import swaggerAutogen from 'swagger-autogen'
import fs from 'fs'

const baseDir = 'swagger'

const routes = [
    {
        file: '../routes/posts.ts',
        output: './swagger-posts.json',
        prefix: '/posts',
    },
    // {
    //     file: '../routes/comments.ts',
    //     output: './swagger-comments.json',
    //     prefix: '/comments',
    // },
]

const docTemplate = {
    openapi: '3.0.0',
    info: {
        title: '게시글/댓글 API',
        version: '1.0.0',
    },
    basePath: '/',
    schemes: ['http'],
    paths: {},
    components: {},
}

const generateSwaggerFiles = async () => {
    const swaggerFiles = []

    // 각 라우트 파일에 대해 Swagger JSON 파일 생성
    for (const route of routes) {
        const doc = { ...docTemplate }
        await swaggerAutogen()(route.output, [route.file], doc)
        swaggerFiles.push({ file: route.output, prefix: route.prefix })
    }

    // 생성된 Swagger 파일 병합
    mergeSwaggerFiles(swaggerFiles)
}

const mergeSwaggerFiles = (files) => {
    const mergedSwagger = { ...docTemplate, paths: {}, components: {} }

    files.forEach(({ file, prefix }) => {
        const swaggerData = JSON.parse(
            fs.readFileSync(`${baseDir}/${file}`, 'utf-8')
        )

        // 각 path에 prefix 추가
        Object.entries(swaggerData.paths).forEach(([path, methods]) => {
            mergedSwagger.paths[`${prefix}${path}`] = methods
        })

        // components 병합
        mergedSwagger.components = {
            ...mergedSwagger.components,
            ...swaggerData.components,
        }
    })

    fs.writeFileSync(
        `./${baseDir}/swagger.json`,
        JSON.stringify(mergedSwagger, null, 2),
        'utf-8'
    )
    console.log(
        'Swagger files have been merged into swagger.json with prefixes'
    )
}

generateSwaggerFiles()
