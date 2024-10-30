import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'
import { User } from '.'

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'varchar', length: 255 })
    title: string

    @Column({ type: 'text' })
    content: string

    @ManyToOne(() => User, (user) => user.posts)
    user: User

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamp' })
    modified_at: Date
}
