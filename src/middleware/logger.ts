import winston from 'winston'
import morgan, { StreamOptions } from 'morgan'
import { Response } from 'express'

const { combine, timestamp, printf, colorize } = winston.format

const logFormat = printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`
})

const logger = winston.createLogger({
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    transports: [
        new winston.transports.Console({
            format:
                process.env.NODE_ENV === 'development'
                    ? combine(colorize(), logFormat)
                    : logFormat,
        }),
    ],
})

const httpStream: StreamOptions = {
    write: (message) => {
        logger.info(
            message.replace(
                /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
                ''
            )
        )
    },
}

const skip = (_, res: Response): boolean => {
    if (process.env.NODE_ENV === 'production') {
        return res.statusCode < 400
    }
    return false
}

const logMiddleware = morgan('dev', { stream: httpStream, skip })

export { logger, logMiddleware }
