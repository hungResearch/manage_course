'use strict'

const mongoose = require('mongoose')
const {countConnect} = require('../helpers/check.connect.database')
const {db: {host, port, name}} = require('../config/config.db')

const connectString = `mongodb://${host}:${port}/${name}`

class Database {
    
    constructor(){
        this.connect()
    }

    //connect
    connect(type = 'mongodb'){
        if(1 === 1){
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true})
        }

        mongoose.connect(connectString).then( _ => 
            {
                console.log(`Connected Mongodb Success`, countConnect());
                
            }
        )
        .catch(err => console.log(`Error Connect!`))
    }
    
    static getInstance() {
        if(!Database.instance){
            Database.instance = new Database()
        }

        return Database.instance
    }
}


const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb
