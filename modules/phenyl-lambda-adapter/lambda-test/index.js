const { createLambdaHandler } = require('phenyl-lambda-adapter')

class Runner {
  run(requestData, sessionId) {
    return new Promise((resolve, reject) => {
      const responseData = { korisu: 'kerikorisu' }
      return resolve(responseData)
    })
  }
}

const runner = new Runner()

export const handler = createLambdaHandler(runner)
