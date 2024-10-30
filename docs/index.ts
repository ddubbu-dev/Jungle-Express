// TODO: 수정 필요, 현재는 docs/output.json 수기 작성 중
import swaggerAutogen from 'swagger-autogen'

const doc = {
    info: {
        version: 'v1.0.0',
        title: 'Express 연습',
    },
    // components: {
    //     securitySchemes: {
    //         bearerAuth: {
    //             type: 'http',
    //             scheme: 'bearer',
    //         },
    //     },
    // },
}

const outputFile = './output.json'
const endpointsFiles = ['../routes/posts.ts']

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc)
