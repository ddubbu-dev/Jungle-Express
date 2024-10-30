export interface PostCreateBody {
    title: string
    content: string
}

export interface PostUpdateBody {
    post_id: string
    title: string
    content: string
}
