import { ServerError } from './../errors/serverError'
import { Controller } from './../protocols/controller'
import { badRequest } from './../helpers/httpHelper'
import { MissingParamError } from '../errors/missingParamError'
import { HttpResponse, HttpRequest } from '../protocols/http'
import { EmailValidator } from '../protocols/emailValidator'
import { InvalidParamError } from '../errors/invalidParamError'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const isEmailValid = this.emailValidator.isValid(httpRequest.body.email)

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}
