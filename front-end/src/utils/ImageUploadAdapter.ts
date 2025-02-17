import config from "@/config/config";

class ImageUploadAdapter {
    private loader: any;
    private xhr: XMLHttpRequest;

    constructor(loader: any) {
        this.loader = loader;
        this.xhr = new XMLHttpRequest();
    }

    upload() {
        return this.loader.file.then(
            (file: File) =>
                new Promise((resolve, reject) => {
                    const formData = new FormData();
                    formData.append('image', file);

                    this.xhr.open('POST', `${config.API_URL}/blogs/upload-image`, true);

                    //  Add your authentication token if required
                    // const token = localStorage.getItem('token');
                    // if (token) {
                    //     this.xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                    // }

                    this.xhr.responseType = 'json';

                    this.xhr.addEventListener('load', () => {
                        const response = this.xhr.response;
                        if (this.xhr.status === 200) {
                            resolve({
                                default: `${config.PUBLIC_URL}${response.url}`
                            });
                        } else {
                            console.error('Upload failed:', response);
                            reject(response?.message || 'Upload failed');
                        }
                    });

                    this.xhr.addEventListener('error', () => {
                        console.error('Network error during upload');
                        reject('Network error occurred during upload');
                    });
                    this.xhr.addEventListener('abort', () => reject('Upload aborted'));

                    this.xhr.send(formData);
                })
        );
    }

    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }
}

export default ImageUploadAdapter;