/*global describe, it, expect, Observer */


//noinspection JSHint,JSLint
var global = Function('return this')();

describe("dotBox.utility.Observer", function () {

    describe("constructor", function () {

        it("can construct with new keyword", function () {

            var target;


            target = new Observer();

            expect(target).not.toBeNull();
            expect(target instanceof Observer);

            expect(global._channelSubscribers).toBeUndefined();


        });


        it("can construct without new keyword", function () {

            var target;


            //noinspection JSLint,JSPotentiallyInvalidConstructorUsage
            target = Observer();

            expect(target).not.toBeNull();
            expect(target instanceof Observer);


            expect(global._channelSubscribers).toBeUndefined();


        });


        it("can construct two instances without sharing state", function () {

            var target1,
                target2;


            target1 =  new Observer();
            target2 = new Observer();

            expect(target1._channelSubscribers).not.toBe(target2._channelSubscribers);


        });

    });


    describe("subscribe", function () {


        it("should add a new channel if one does not yet exist", function () {

            var target,
                CHANNEL_ID = "TV LAND",
                callback,
                actChannel;

            callback = function someFunc() {

            };

            target = new Observer();


            target.subscribe(CHANNEL_ID, callback);

            expect(Object.keys(target._channelSubscribers).length).toBe(1);

            actChannel = target._channelSubscribers[CHANNEL_ID];

            expect(actChannel).not.toBeUndefined();
            expect(actChannel).not.toBeNull();

            expect(actChannel.length).toBe(1);
            expect(actChannel[0].priority).toBe(-1);
            expect(actChannel[0].callback).toBe(callback);



        });

        it("should add to an existing channel if it already exists", function () {


            var target,
                CHANNEL_ID = "TV LAND",
                callback1,
                callback2,
                actChannel;

            callback1 = function someFunc() {

            };

            callback2 = function someFunc2() {

            };

            target = new Observer();
            target.subscribe(CHANNEL_ID, callback1);


            target.subscribe(CHANNEL_ID, callback2);


            expect(Object.keys(target._channelSubscribers).length).toBe(1);
            actChannel = target._channelSubscribers[CHANNEL_ID];
            expect(actChannel).not.toBeUndefined();
            expect(actChannel).not.toBeNull();

            expect(actChannel.length).toBe(2);
            expect(actChannel[0].callback).toBe(callback1);
            expect(actChannel[0].priority).toBe(-1);
            expect(actChannel[1].callback).toBe(callback2);
            expect(actChannel[1].priority).toBe(-2);

        });

        it("should create a second channel if there are already channels but supplied channel does not yet exist", function () {


            var target,
                CHANNEL_ID1 = "TV LAND",
                CHANNEL_ID2 = "Zombie Land",
                callback1,
                callback2,
                actChannel1,
                actChannel2;

            callback1 = function someFunc() {

            };

            callback2 = function someFunc2() {

            };

            target = new Observer();
            target.subscribe(CHANNEL_ID1, callback1);


            target.subscribe(CHANNEL_ID2, callback2);


            expect(Object.keys(target._channelSubscribers).length).toBe(2);

            actChannel1 = target._channelSubscribers[CHANNEL_ID1];
            expect(actChannel1).not.toBeUndefined();
            expect(actChannel1).not.toBeNull();

            expect(actChannel1.length).toBe(1);
            expect(actChannel1[0].callback).toBe(callback1);


            actChannel2 = target._channelSubscribers[CHANNEL_ID2];
            expect(actChannel2).not.toBeUndefined();
            expect(actChannel2).not.toBeNull();

            expect(actChannel2.length).toBe(1);
            expect(actChannel2[0].callback).toBe(callback2);


        });

    });

    describe("publish", function () {

        it("should now throw if channel not found", function () {

            var target,
                CHANNEL_ID = "TV LAND",
                act;

            target = new Observer();


            act = function () {
                target.publish(CHANNEL_ID, {});
            };

            expect(act).not.toThrow();



        });

        it("should not throw if channel null", function () {

            var target,
                CHANNEL_ID = "TV LAND",
                act;

            target = new Observer();

            target._channelSubscribers[CHANNEL_ID] = null;


            act = function () {
                target.publish(CHANNEL_ID, {});
            };

            expect(act).not.toThrow();



        });

        it("should not throw if channel is empty", function () {

            var target,
                CHANNEL_ID = "TV LAND",
                act;

            target = new Observer();

            target._channelSubscribers[CHANNEL_ID] = [];


            act = function () {
                target.publish(CHANNEL_ID, {});
            };

            expect(act).not.toThrow();



        });

        it("should execute one call back if only one exists", function () {


            var target,
                CHANNEL_ID1 = "TV LAND",
                CHANNEL_ID2 = "ZOMBIE LAND",
                callBack1,
                callBack2,
                callArgs1 = [],
                callArgs2 = [],
                msg = {};

            callBack1 = function (m) { callArgs1.push(m); };
            callBack2 = function (m) { callArgs2.push(m); };

            target = new Observer();
            target.subscribe(CHANNEL_ID1, callBack1);
            target.subscribe(CHANNEL_ID2, callBack2);

            target.publish(CHANNEL_ID1, msg);

            expect(callArgs1.length).toBe(1);
            expect(callArgs1[0]).toBe(msg);

            expect(callArgs2.length).toBe(0);


        });

        it("should execute call backs in subscribe order if two exist", function () {

            var target,
                CHANNEL_ID1 = "TV LAND",
                CHANNEL_ID2 = "ZOMBIE LAND",
                callBack1,
                callBack2,
                callBackB,
                callArgs1 = [],
                callArgs2 = [],
                callArgsB = [],
                msg = {};

            callBack1 = function (m) { callArgs1.push(m); };
            callBack2 = function (m) { callArgs2.push(m); };
            callBackB = function (m) { callArgsB.push(m); };

            target = new Observer();
            target.subscribe(CHANNEL_ID1, callBack1);
            target.subscribe(CHANNEL_ID1, callBack2);
            target.subscribe(CHANNEL_ID2, callBackB);

            target.publish(CHANNEL_ID1, msg);

            expect(callArgs1.length).toBe(1);
            expect(callArgs1[0]).toBe(msg);

            expect(callArgs2.length).toBe(1);
            expect(callArgs2[0]).toBe(msg);

            expect(callArgsB.length).toBe(0);

        });

        it("should publish any arguments to subscribers", function () {

            var target,
                CHANNEL_ID = "zombie.land",
                ARG1 = 'stuff',
                ARG2 = 1.5,
                sub1,
                sub2,
                sub1Args = {},
                sub1CallCount = 0,
                sub2CallCount = 0;

            sub1 = function (a, b) {
                sub1Args.a = a;
                sub1Args.b = b;
                sub1CallCount += 1;
            };

            sub2 = function () {
                sub2CallCount += 1;
            };

            target = new Observer();

            target.subscribe(CHANNEL_ID, sub1);
            target.subscribe(CHANNEL_ID, sub2);

            target.publish(CHANNEL_ID, ARG1, ARG2);


            expect(sub1CallCount).toBe(1);
            expect(sub1Args.a).toBe(ARG1);
            expect(sub1Args.b).toBe(ARG2);

            expect(sub2CallCount).toBe(1);





        });

        it("should not publish after a subscriber sets this.cancel = true", function () {

            var target,
                CHANNEL = "ZOMBIE LAND",
                callBack1,
                callBack2,
                callBack3,
                callArgs1 = [],
                callArgs2 = [],
                callArgs3 = [],
                msg = {};

            callBack1 = function () { callArgs1.push(arguments); };
            callBack2 = function () {
                callArgs2.push(arguments);
                //noinspection JSUnusedGlobalSymbols
                this.cancel = true;
            };
            callBack3 = function () { callArgs3.push(arguments); };

            target = new Observer();
            target.subscribe(CHANNEL, callBack1);
            target.subscribe(CHANNEL, callBack2);
            target.subscribe(CHANNEL, callBack3);

            target.publish(CHANNEL, msg);

            expect(callArgs1.length).toBe(1);
            expect(callArgs1[0][0]).toBe(msg);

            expect(callArgs2.length).toBe(1);
            expect(callArgs2[0][0]).toBe(msg);

            //The third call should not be been executed because
            //the second subscriber canceled it.
            expect(callArgs3.length).toBe(0);

        });

        it("should publish call subscribers with this.channelId = the channel that was published on", function () {

            var target,
                CHANNEL = "ZOMBIE LAND",
                callBack1,
                callBack2,
                callCount1 = 0,
                callCount2 = 0,
                msg = {};

            callBack1 = function () {
                callCount1 += 1;
                expect(this.channelId).toBe(CHANNEL);
            };
            callBack2 = function () {
                callCount2 += 1;
                expect(this.channelId).toBe(CHANNEL);
            };

            target = new Observer();
            target.subscribe(CHANNEL, callBack1);
            target.subscribe(CHANNEL, callBack2);

            target.publish(CHANNEL, msg);

            expect(callCount1).toBe(1);
            expect(callCount2).toBe(1);

        });

        it("should return false if a subscriber set this.cancel = true", function () {

            var target,
                CHANNEL = 'zombie.land',
                sub1,
                actResult;

            target = new Observer();

            sub1 = function () {
                //noinspection JSUnusedGlobalSymbols
                this.cancel = true;
            };

            target.subscribe(CHANNEL, sub1);


            actResult = target.publish(CHANNEL);


            expect(actResult).toBe(false);



        });

        it("should return true if no subscribers set this.cancel = true", function () {

            var target,
                CHANNEL = 'zombie.land',
                sub1,
                sub2,
                actResult;

            target = new Observer();

            sub1 = function () { };
            sub2 = function () {};

            target.subscribe(CHANNEL, sub1);
            target.subscribe(CHANNEL, sub2);


            actResult = target.publish(CHANNEL);


            expect(actResult).toBe(true);



        });
    });

    describe("unsubscribe", function () {

        it("should now throw if channel not found", function () {

            var target,
                CHANNEL_ID = "TV LAND",
                act;

            target = new Observer();


            act = function () {
                target.unsubscribe(CHANNEL_ID, function () {});
            };

            expect(act).not.toThrow();



        });

        it("should not throw if channel null", function () {

            var target,
                CHANNEL_ID = "TV LAND",
                act;

            target = new Observer();

            target._channelSubscribers[CHANNEL_ID] = null;


            act = function () {
                target.unsubscribe(CHANNEL_ID, function () {});
            };

            expect(act).not.toThrow();



        });

        it("should not throw if channel is empty", function () {

            var target,
                CHANNEL_ID = "TV LAND",
                act;

            target = new Observer();

            target._channelSubscribers[CHANNEL_ID] = [];


            act = function () {
                target.unsubscribe(CHANNEL_ID, function () {});
            };

            expect(act).not.toThrow();



        });

        it("should remove the callback from the given channel and not others", function () {

            var target,
                CHANNEL1 = "zombie.land",
                CHANNEL2 = "zombie.world",
                s1,
                s2,
                s3,
                actCh1,
                actCh2;

            s1 = function s1f() {};
            s2 = function s2f() {};
            s3 = function s3f() {};

            target = new Observer();

            target.subscribe(CHANNEL2, s2);

            target.subscribe(CHANNEL1, s1);
            target.subscribe(CHANNEL1, s2);
            target.subscribe(CHANNEL1, s3);


            target.unsubscribe(CHANNEL1, s2);


            actCh1 = target._channelSubscribers[CHANNEL1];
            actCh2 = target._channelSubscribers[CHANNEL2];

            expect(actCh1).not.toBeUndefined();
            expect(actCh1).not.toBeNull();
            expect(actCh1.length).toBe(2);
            expect(actCh1[0].callback).toBe(s1);
            expect(actCh1[1].callback).toBe(s3);

            expect(actCh2).not.toBeUndefined();
            expect(actCh2).not.toBeNull();
            expect(actCh2.length).toBe(1);
            expect(actCh2[0].callback).toBe(s2);

        });

        it("should remove channel if no others subscribers remain", function () {

            var target,
                CHANNEL1 = "zombie.land",
                CHANNEL2 = "zombie.world",
                s1,
                s2,
                actCh1,
                actCh2;

            s1 = function s1f() {};
            s2 = function s2f() {};

            target = new Observer();

            target.subscribe(CHANNEL2, s2);

            target.subscribe(CHANNEL1, s1);
            target.subscribe(CHANNEL1, s2);


            target.unsubscribe(CHANNEL2, s2);


            actCh1 = target._channelSubscribers[CHANNEL1];
            actCh2 = target._channelSubscribers[CHANNEL2];

            expect(actCh2).toBeUndefined();

            expect(actCh1).not.toBeUndefined();
            expect(actCh1).not.toBeNull();
            expect(actCh1.length).toBe(2);
            expect(actCh1[0].callback).toBe(s1);
            expect(actCh1[1].callback).toBe(s2);



        });


    });

    describe("call order", function () {

        it("subscribers with largest priority should be called first if priority supplied", function () {

            var target,
                CHANNEL = 'zombie.world',
                output = '';

            target = new Observer();

            target.subscribe(CHANNEL, function () { output = output + "a-"; }, 10);
            target.subscribe(CHANNEL, function () { output = output + "b-"; }, 33);

            target.publish(CHANNEL);

            //Larger priority numbers should come first.
            expect(output).toBe('b-a-');


            //Try it in opposite order we should get the same result.
            output = '';
            target = new Observer();

            target.subscribe(CHANNEL, function () { output = output + "b-"; }, 33);
            target.subscribe(CHANNEL, function () { output = output + "a-"; }, 10);


            target.publish(CHANNEL);

            //Larger priority numbers should come first.
            expect(output).toBe('b-a-');


        });

        it("subscribers should be called in subscribe order if no priority supplied", function () {

            var target,
                CHANNEL = 'zombie.world',
                output = '';

            target = new Observer();

            target.subscribe(CHANNEL, function () { output = output + "1-"; });
            target.subscribe(CHANNEL, function () { output = output + "2-"; });

            target.publish(CHANNEL);

            expect(output).toBe('1-2-');



        });

        it("subscribers with priority specified should be called before subscribers without", function () {

            var target,
                CHANNEL = 'zombie.world',
                output = '';

            target = new Observer();


            target.subscribe(CHANNEL, function () { output = output + "a-"; });
            target.subscribe(CHANNEL, function () { output = output + "b-"; }, 10);
            target.subscribe(CHANNEL, function () { output = output + "c-"; });
            target.subscribe(CHANNEL, function () { output = output + "d-"; }, 33);
            target.subscribe(CHANNEL, function () { output = output + "e-"; });

            target.publish(CHANNEL);

            //Larger priority numbers should come first.
            expect(output).toBe('d-b-a-c-e-');
        });


        it("can add and remove priority and non-priority subscribers", function () {

            var target,
                CHANNEL = 'zombie.world',
                output = '',
                subC,
                subD;

            target = new Observer();


            subC = function () { output = output + "c-"; };
            subD = function () { output = output + "d-"; };

            target.subscribe(CHANNEL, function () { output = output + "a-"; });
            target.subscribe(CHANNEL, function () { output = output + "b-"; }, 10);
            target.subscribe(CHANNEL, subC);
            target.subscribe(CHANNEL, subD, 33);
            target.subscribe(CHANNEL, function () { output = output + "e-"; });

            target.unsubscribe(CHANNEL, subC);


            target.publish(CHANNEL);

            //Larger priority numbers should come first.
            expect(output).toBe('d-b-a-e-');


            output = '';
            target.subscribe(CHANNEL, function () { output = output + "1-"; }, 14);
            target.subscribe(CHANNEL, function () { output = output + "2-"; }, 100);
            target.publish(CHANNEL);


            expect(output).toBe('2-d-1-b-a-e-');

            output = '';
            target.unsubscribe(CHANNEL, subD);
            target.publish(CHANNEL);
            expect(output).toBe('2-1-b-a-e-');


        });


    });

});

