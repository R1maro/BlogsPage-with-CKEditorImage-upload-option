<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\TemporaryUpload;
use Illuminate\Http\Request;
use App\Http\Resources\BlogResource;
use App\Http\Requests\StoreBlogRequest;
use App\Http\Requests\UpdateBlogRequest;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        try {
            $blogs = Blog::query()
                ->with(['media'])
                ->when($request->status, function ($query, $status) {
                    return $query->where('status', $status);
                })
                ->when($request->search, function ($query, $search) {
                    return $query->where(function ($q) use ($search) {
                        $q->where('title', 'like', "%{$search}%")
                            ->orWhere('content', 'like', "%{$search}%");
                    });
                })
                ->when($request->category_id, function ($query, $categoryId) {
                    return $query->whereHas('categories', function ($q) use ($categoryId) {
                        $q->where('categories.id', $categoryId);
                    });
                })
                ->latest('published_at')
                ->paginate($request->per_page ?? 10);

            return BlogResource::collection($blogs);
        }catch (\Exception $exception){
            return response()->json(['message' => $exception->getMessage()], 400);
        }
    }


    public function store(StoreBlogRequest $request)
    {
        try {
//            $user = auth('sanctum')->user();
//
//            if (!$user) {
//                return response()->json(['message' => 'Unauthenticated'], 401);
//            }
            $validated = $request->validated();

            unset($validated['featured_image']);

            $blog = Blog::create([
                ...$validated,
//                'user_id' => $user->id,
            ]);

            if ($request->hasFile('featured_image')) {
                $blog->addMediaFromRequest('featured_image')
                    ->withResponsiveImages()
                    ->toMediaCollection('blog_images');
            }

            $this->moveTemporaryMediaToBlog($blog);

            if ($request->has('categories')) {
                $blog->categories()->sync($request->categories);
            }

            if ($request->has('tags')) {
                $blog->tags()->sync($request->tags);
            }

            return new BlogResource($blog);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function show(Blog $blog)
    {
        return new BlogResource($blog->load(['categories', 'tags',]));
    }


    public function update(UpdateBlogRequest $request, Blog $blog)
    {

        $validated = $request->validated();

        unset($validated['featured_image']);

        $blog->update($validated);

        if ($request->hasFile('featured_image')) {
            $blog->clearMediaCollection('blog_images');

            $blog->addMediaFromRequest('featured_image')
                ->withResponsiveImages()
                ->toMediaCollection('blog_images');
        }

        $this->moveTemporaryMediaToBlog($blog);


        if ($request->has('categories')) {
            $blog->categories()->sync($request->categories);
        }

        if ($request->has('tags')) {
            $blog->tags()->sync($request->tags);
        }

        return new BlogResource($blog->fresh(['categories', 'tags']));
    }

    public function destroy(Blog $blog)
    {
        $blog->delete();
        return response()->noContent();
    }

    public function restore($id)
    {
        $blog = Blog::withTrashed()->findOrFail($id);
        $blog->restore();
        return new BlogResource($blog);
    }

    public function forceDelete($id)
    {
        $blog = Blog::withTrashed()->findOrFail($id);
        $blog->forceDelete();
        return response()->noContent();
    }

    public function uploadImage(Request $request)
    {
        try {

            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
            ]);

            if (!$request->hasFile('image')) {
                return response()->json(['message' => 'No image file provided'], 400);
            }

            $temporaryUpload = new TemporaryUpload();
            $temporaryUpload->save();

            $media = $temporaryUpload->addMediaFromRequest('image')
                ->toMediaCollection('temp_content');

            $fullUrl = $media->getUrl();


            return response()->json([
                'url' => $fullUrl,
                'message' => 'Image uploaded successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Image upload failed', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Upload failed: ' . $e->getMessage()], 500);
        }
    }

    private function moveTemporaryMediaToBlog(Blog $blog)
    {
        $content = $blog->content;

        $existingMedia = $blog->getMedia('content');

        $processedTempUploads = collect();

        $temporaryUploads = TemporaryUpload::where('created_at', '>=', now()->subHour())
            ->whereHas('media')
            ->get();

        foreach ($temporaryUploads as $tempUpload) {
            $mediaWasMoved = false;

            foreach ($tempUpload->getMedia('temp_content') as $media) {
                $oldUrl = $media->getUrl();
                $newMedia = $media->move($blog, 'content');
                $newUrl = $newMedia->getUrl();

                $content = str_replace($oldUrl, $newUrl, $content);
                $mediaWasMoved = true;
            }

            if ($mediaWasMoved) {
                $tempUpload->delete();
            }

            $processedTempUploads->push($tempUpload->id);
        }

        $blog->update(['content' => $content]);

        foreach ($existingMedia as $media) {
            $mediaUrl = $media->getUrl();
            if (!str_contains($content, $mediaUrl)) {
                $media->delete();
            }
        }

        $this->cleanupOldTemporaryUploads();
    }

    private function cleanupOldTemporaryUploads()
    {
        TemporaryUpload::where('created_at', '<', now()->subHour())
            ->chunk(100, function ($uploads) {
                foreach ($uploads as $upload) {
                    $upload->clearMediaCollection('temp_content');
                    $upload->delete();
                }
            });
    }
}
