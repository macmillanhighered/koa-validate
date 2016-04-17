'use strict';

var data = {
  store: {
    book: [
      { category: "reference",
        author: "Nigel Rees",
        title: "Sayings of the Century",
        price: 8.95
      },
      { category: "fiction",
        author: "Evelyn Waugh",
        title: "Sword of Honour",
        price: 12.99
      },
      { category: "fiction",
        author: "Herman Melville",
        title: "Moby Dick",
        isbn: "0-553-21311-3",
        price: 8.99
      },
      { category: "fiction",
        author: "J. R. R. Tolkien",
        title: "The Lord of the Rings",
        isbn: "0-395-19395-8",
        price: 22.99
      }
    ],
    bicycle: {
      color: "red",
      price: 19.95
    }
  }
};



var koa = require('koa'),
request = require('supertest'),
appFactory = require('./appFactory.js');
require('should');

describe('koa-validate' , function(){
	it("nobody to check" , function(done){
		var app = appFactory.create(1);
		app.router.post('/json',function*(){
			this.checkBody('/').notEmpty();
			this.checkBody('/store/book[0]/price').get(0).eq(8.95);
			this.checkBody('#/store/book[0]/category').first().trim().eq('reference');
			this.checkBody('/store/book[*]/price').filter(function(v,k,o){
				return v>10
			}).first().gt(10)
			if(this.errors) {
				this.status=500;
			}else{
				this.status=200;
			}
		});
		var req = request(app.listen());
		req.post('/json')
		.send(data)
		.expect(200 , done);
	});

});