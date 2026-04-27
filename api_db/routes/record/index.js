'use strict'

import * as mongodb from "mongodb_helpers"

import * as helpers from "jsonld_helpers"

let URI = 'mongodb://tactik8:Temp4now@192.168.2.243:27017/?authMechanism=DEFAULT'

let db = new mongodb.MongoDB()
db.uri = process.env.DATABASE_URI || URI
db.databaseID = process.env.DATABASE_ID || "n8n"
db.tenantID = process.env.TENANT_ID || "test"
db.init()





//module.exports = async function (fastify, opts) {

export default async function (fastify, opts) {
    fastify.get('/', async function (request, reply) {

        await db.init()
        if (db._dbInitializedFlag == false) {
            return new Error('Could not initialize DB');
        }

        let { filter, orderBy, orderDirection, limit, offset } = request.query

        let action = await db.search(filter, orderBy, orderDirection, limit, offset)

        if(action.isCompleted){
            return action.result
        }
        
        return new Error(action.error);

    })

    fastify.post('/', async function (request, reply) {

        await db.init()
        if (db._dbInitializedFlag == false) {
            return new Error('Could not initialize DB');
        }


        let data = request.body

        let action = await db.post(data)

        if(action.isCompleted){
            return action.result
        }
        
        return new Error(action.error);

    })

    fastify.delete('/', async function (request, reply) {

        await db.init()
        if (db._dbInitializedFlag == false) {
            return new Error('Could not initialize DB');
        }


        let {filter} = request.query


        let action = await db.delete(filter)

        
        if(action.isCompleted){
            return action.result
        }
        
        return new Error(action.error);

    })


    fastify.get('/:record_id', async function (request, reply) {

        await db.init()
        if (db._dbInitializedFlag == false) {
            return new Error('Could not initialize DB');
        }

        let record_id = request.params.record_id


        let action = await db.get(record_id)

        
        if(action.isCompleted){
            return action.result?.[0] || {}
        }
        
        return new Error(action.error);

    })

    fastify.post('/:record_id', async function (request, reply) {

        await db.init()
        if (db._dbInitializedFlag == false) {
            return new Error('Could not initialize DB');
        }

        let data = request.body


        let action = await db.post(data)

        
        if(action.isCompleted){
            return action.result?.[0] || {}
        }
        
        return new Error(action.error);

    })

    fastify.delete('/:record_id', async function (request, reply) {

        await db.init()
        if (db._dbInitializedFlag == false) {
            return new Error('Could not initialize DB');
        }

        let record_id = request.params.record_id

        let filter = {"@id": record_id}

        let action = await db.delete(filter)

        if(action.isCompleted){
            return action.result?.[0] || {}
        }
        
        return new Error(action.error);

    })


    fastify.get('/:record_id/:propertyID', async function (request, reply) {

        await db.init()
        if (db._dbInitializedFlag == false) {
            return new Error('Could not initialize DB');
        }

        let record_id = request.params.record_id
        let propertyID = request.params.propertyID

        let { filter, orderBy, orderDirection, limit, offset } = request.query


        let action = await db.get(record_id)
        let record = action.result?.[0] || {}
        
        let values = helpers.getValues(record, propertyID)

        if(action.isCompleted){
            return values
        }
        
        return new Error(action.error);

    })

    fastify.post('/:record_id/:propertyID', async function (request, reply) {

        await db.init()
        if (db._dbInitializedFlag == false) {
            return new Error('Could not initialize DB');
        }

        let record_id = request.params.record_id
        let propertyID = request.params.propertyID
        let data = request.body

        let action = await db.get(record_id)
        let record = action.result?.[0] || {}
        
        helpers.setValues(record, propertyID, data)

        let action2 = await db.post(record)

        if(action2.isCompleted){
            return values
        }
        
        return new Error(action2.error);

    })

}


