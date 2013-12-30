Observer-JS
===========

A JavaScript observer implementation with subscription priority, and event cancelation features.


Basic Pub-Sub
-------------
[Live Example](http://jsfiddle.net/gmetzker/Lz995/)
* Add subscribers to a 'channel'.
* Publish messages to a 'channel'.

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
