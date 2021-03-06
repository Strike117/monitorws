/*
 * File: app/controller/WebsocketController.js
 *
 * This file was generated by Sencha Architect version 3.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.2.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('monitor.controller.WebsocketController', {
    extend: 'Ext.app.Controller',

    stores: [
        'UserStore'
    ],

    onLaunch: function() {
        var messageStore  = Ext.getStore('MessageStore');
        var userStore = Ext.getStore('UserStore');
        var users = {};
        ws = new WebSocket('ws://10.50.24.156:8000');

        ws.onmessage = function(data){

            data = Ext.JSON.decode(data.data);
            var user = data.user;
            console.log('data',data);
            switch(data.action){
                case 'notification':
                    console.log('notification');
                    console.log(user);
                    console.log(data);

                    //             users[user] = users[user] || [];
                    //             for(var length = users[user].length, i = 0; i<length; ++i){
                    //                 messageStore.add({'content':Ext.JSON.encode(data),'user':data.user,'uuid':users[user][i]});
                    //             }

                    messageStore.add({'content':Ext.JSON.encode(data),'user':data.user,'uuid':data.uuid});

                    var filters = messageStore.filters.items;
                    console.log(filters);


                    if(filters.length === 0){
                        messageStore.filter([{property:'user',value:'Ext_Temporal'},{property:'uuid',value:'Ext_Temporal'}]);
                    }else{
                        var user_T = filters[0].value;
                        var uuid_T = filters[1].value;
                        console.log(user_T);
                        messageStore.clearFilter();
                        messageStore.filter([{property:'user',value:user_T},{property:'uuid',value:uuid_T}]);
                    }
                    break;
                case 'connection':
                    console.log('connection');
                    console.log(user);
                    console.log(data);

                    users[user] = users[user] || [];
                    userStore.add({'user': data.user,'uuid':data.uuid});
                    users[user].push(data.uuid);

                    break;
                case 'disconnection':
                    console.log('disconnection');
                    console.log(user);
                    console.log(data);
                    var index = userStore.findBy(function(record){
                        return record.data.uuid==data.uuid && record.data.user==data.user;
                    });
                    userStore.removeAt(index);

                    break;
            }
        };

        ws.onopen = function() {

            var message ={
                action: 'monitor'
            };

            ws.send(JSON.stringify(message));
        };
    }

});
