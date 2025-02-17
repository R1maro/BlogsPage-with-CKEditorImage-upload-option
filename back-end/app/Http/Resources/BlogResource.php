<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'content' => $this->content,
            'excerpt' => $this->excerpt,
            'featured_image' => [
                'original' => $this->getFirstMediaUrl('blog_images'),
                'thumbnail' => $this->getFirstMediaUrl('blog_images', 'thumbnail'),
                'responsive' => $this->getFirstMedia('blog_images')?->responsive ?? null,
            ],
            'status' => $this->status,
            'published_at' => $this->published_at?->format('Y-m-d H:i:s'),
            'read_time' => $this->read_time,
            'meta' => [
                'title' => $this->meta_title,
                'description' => $this->meta_description,
                'keywords' => $this->meta_keywords,
            ],
//            'author' => new UserResource($this->whenLoaded('user')),
            'categories' => CategoryResource::collection($this->whenLoaded('categories')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            'deleted_at' => $this->deleted_at?->format('Y-m-d H:i:s'),

            // Add useful URL attributes
            'urls' => [
                'view' => url("/blog/{$this->slug}"),
                'edit' => url("/admin/blog/{$this->id}/edit"),
            ],

            // Add conditional attributes
            'can' => [
                'update' => $request->user()?->can('update', $this->resource),
                'delete' => $request->user()?->can('delete', $this->resource),
            ],
        ];
    }

    public function with($request): array
    {
        return [
            'meta' => [
                'version' => '1.0',
            ],
        ];
    }
}
