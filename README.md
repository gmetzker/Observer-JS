Observer-JS
===========

A JavaScript observer implementation with subscription priority, and event cancellation features.


Basic Pub-Sub
-------------
[Live Example](http://jsfiddle.net/gmetzker/Lz995/)
* Create a new instance: ```var ob = new Observer();```
* Add subscribers to a channel:  ```ob.subscribe(channelId, subscriberFunc);```
* Publish messages to a channel: ```ob.publish(channelId [, arg0, arg1, ...]);```

```javascript
    var ob = new Observer();

    ob.subscribe('some.event', function () { console.log('Luke'); });
    ob.subscribe('some.event', function () { console.log('Vader'); });
    ob.subscribe('some.event.other', function () { console.log('Yoda'); });
    
    ob.publish('some.event');
```

#### Output
```
  Luke
  Vader
>
```

Publish with arguments
----------------------
[Live Example](http://jsfiddle.net/gmetzker/PRb3Z/)
* You can publish with any arguments
* All arguments after the channel are passed to the subscribers.

```javascript
    var ob = new Observer();

    ob.subscribe('some.event', function (greeting) { console.log(greeting + 'Luke'); });
    ob.subscribe('some.event', function (greeting) { console.log(greeting + 'Vader'); });
    
    ob.publish('some.event', 'Hello ');
```
#### Output
```
  Hello Luke
  Hello Vader
>
```

this.channelId
---------
[Live Example](http://jsfiddle.net/gmetzker/JBa6N/)

* **this.channelId** in the subscriber method will indicate the current channel.

```javascript
    var ob = new Observer();

    ob.subscribe('some.event', function () { console.log(this.channelId + ' - Luke'); });
    ob.subscribe('some.event', function () { console.log(this.channelId + ' - Vader'); });
    ob.subscribe('some.event.other', function () { console.log(this.channelId + ' - Yoda'); });
    
    ob.publish('some.event');
```

#### Output
```
  some.event - Luke
  some.event - Vader
>
```

Event Cancellation
-----------------
[Live Example](http://jsfiddle.net/gmetzker/7AZ76/)
* Any subscribers can cancel the event for all lower priority subscribers: ``` this.cancel = true;```
* The result of the publish method indicates if the event was fully published ***(returns true)***, or canceled. ***(returns false)***

```javascript
 var ob = new Observer();

    ob.subscribe('force.push', function () { console.log('Luke: Ouch!'); });
    ob.subscribe('force.push', function () { 
        console.log('Ob1: Blocked');
        this.cancel = true;
    });
    ob.subscribe('force.push', function () { console.log('Solo: Arg!'); });
    
    var complete = ob.publish('force.push');
    if( !complete ) { console.log('force.push failed!'); }
```
#### Output
```
  Luke: Ouch!
  Ob1: Blocked
  force.push failed!
>
```
