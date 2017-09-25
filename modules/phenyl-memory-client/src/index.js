// @flow
import PhenylState from 'phenyl-state/jsnext'
import { createErrorResult } from 'phenyl-utils/jsnext'
import type { PhenylStateParams } from 'phenyl-state/jsnext'

import type {
  EntityClient,
  CommandResultOrError,
  DeleteCommand,
  FetchCommandResultOrError,
  GetCommandResultOrError,
  Id,
  IdQuery,
  IdsQuery,
  InsertCommand,
  SingleInsertCommand,
  MultiInsertCommand,
  RequestData,
  ResponseData,
  QueryResultOrError,
  QueryStringParams,
  SingleQueryResultOrError,
  UpdateCommand,
  WhereQuery,
} from 'phenyl-interfaces'

type MemoryClientParams = {
  phenylState?: PhenylStateParams,
}

// TODO: implement cooler one externally
function generateRandomStr() {
  return 'p' + Math.random().toString().split('.')[1] + 't' + new Date().getTime().toString()
}

export default class PhenylMemoryClient implements EntityClient {
  phenylState: PhenylState

  constructor(params: MemoryClientParams) {
    this.phenylState = new PhenylState(params.phenylState || {})
  }

  /**
   *
   */
  async find(query: WhereQuery): Promise<QueryResultOrError> {
    const entities = this.phenylState.find(query)
    return {
      ok: 1,
      values: entities
    }
  }

  /**
   *
   */
  async findOne(query: WhereQuery): Promise<SingleQueryResultOrError> {
    const entity = this.phenylState.findOne(query)
    if (entity == null) {
      return {
        ok: 0,
        type: 'NotFound',
        message: '"PhenylMemoryClient#findOne()" failed. Could not find any entity with the given query.',
      }
    }
    return {
      ok: 1,
      value: entity
    }
  }

  /**
   *
   */
  async get(query: IdQuery): Promise<SingleQueryResultOrError> {
    try {
      const entity = this.phenylState.get(query)
      return {
        ok: 1,
        value: entity
      }
    }
    catch (e) {
      if (e.constructor.name === 'Error') { // Error from PhenylState
        return {
          ok: 0,
          type: 'NotFound',
          message: `"PhenylMemoryClient#get()" failed. Could not find any entity with the given id: "${query.id}"`,
        }
      }
      return createErrorResult(e)
    }
  }

  /**
   *
   */
  async getByIds(query: IdsQuery): Promise<QueryResultOrError> {
    try {
      const entities = this.phenylState.getByIds(query)
      return {
        ok: 1,
        values: entities
      }
    }
    catch (e) {
      if (e.constructor.name === 'Error') { // Error from PhenylState
        return {
          ok: 0,
          type: 'NotFound',
          message: `"PhenylMemoryClient#getByIds()" failed. Some ids are not found. ids: "${query.ids.join(', ')}"`, // TODO: prevent from showing existing ids
        }
      }
      return createErrorResult(e)
    }
  }

  /**
   *
   */
  async insert(command: InsertCommand): Promise<CommandResultOrError> {
    if (command.values) {
      const result = await this.insertAndGetMulti(command)
      return result.ok
        ? { ok: 1, n: result.n }
        : result
    }
    const result = await this.insertAndGet(command)
    return result.ok
      ? { ok: 1, n: 1 }
      : result
  }

  /**
   *
   */
  async insertAndGet(command: SingleInsertCommand): Promise<GetCommandResultOrError> {
    throw new Error(`Invalid response data: property name "insertAndGet" is not found in response.`)
  }

  /**
   *
   */
  async insertAndGetMulti(command: MultiInsertCommand): Promise<FetchCommandResultOrError> {
    throw new Error(`Invalid response data: property name "insertAndGet" is not found in response.`)
  }

  /**
   *
   */
  async update(command: UpdateCommand): Promise<CommandResultOrError> {
    throw new Error(`Invalid response data: property name "update" is not found in response.`)
  }

  /**
   *
   */
  async updateAndGet(command: UpdateCommand): Promise<GetCommandResultOrError> {
    throw new Error(`Invalid response data: property name "updateAndGet" is not found in response.`)
  }

  /**
   *
   */
  async updateAndFetch(command: UpdateCommand): Promise<FetchCommandResultOrError> {
    throw new Error(`Invalid response data: property name "updateAndFetch" is not found in response.`)
  }

  /**
   *
   */
  async delete(command: DeleteCommand): Promise<CommandResultOrError> {
    throw new Error(`Invalid response data: property name "delete" is not found in response.`)
  }
}