export interface PostCreateBody {
    title: string
    content: string
    user_name: string
    user_password: string
}

export interface PostDeleteBody {
    user_password: string
    post_id: string
}

export interface PostUpdateBody {
    user_password: string
    post_id: string

    title: string
    content: string
}
