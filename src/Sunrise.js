/*  Calculations based on:
    [*1]http://www.navipedia.pl/,
    [*2]"Astronomiczne oblicznenia nie tylko dla geografów" by Kazimierz Borkowski Uniwersytet Mikołaja Kopernika w Toruniu, Toruń 1991.
    [*3]http://www.cs.utsa.edu/~cs1063/projects/Spring2011/Project1/jdn-explanation.html
    [*4]http://quasar.as.utexas.edu/BillInfo/JulianDatesG.html
    [*5]http://aa.usno.navy.mil/faq/docs/GAST.php
    [*6]http://books.google.pl/books?id=ZnNrepLivYEC&lpg=PA17&ots=tmzu0w_Opi&dq=GMST%200hUT&hl=pl&pg=PA17#v=onepage&q=GMST%200hUT&f=false
    [*7]http://aa.usno.navy.mil/faq/docs/SunApprox.php

    alpha - Right ascension (rektascensja)
    sigma - Declination (deklinacja)
    phi - latitude (szerokość geograficzna)
 */

function sunrise() {
    //TODO: create separate converter. Fix names.
    var that = {},
        decToRad = function (deg) {
            return (deg * Math.PI) / 180;
        },
        radToDec = function (rad) {
            return (rad * 180) / Math.PI;
        },
        timeToDec = function (time) {
            return (time.h * 240 + time.m * 4 + time.s) / 16;
        },
        degToDec = function (deg) {
            return deg.d + deg.m / 60 + deg.s / 3600;
        },
        decToTime = function (deg) {
            var s = (deg * 240);
            var m = Math.floor(s / 60);
            var h = Math.floor(m / 60);

            return {h: h, m: m % 60, s: s % 60};
        },
        timeToDeg = function (time) {
            var s = time.s * 15;
            var m = time.m * 15 + Math.floor(s / 60);
            var d = time.h * 15 + Math.floor(m / 60);

            return {d: d, m: m % 60, s: s % 60};
        },
        degToTime = function (deg) {
            var s = deg.m * 4 + deg.s * 0.066666;
            var m = deg.d * 4 + Math.floor(s / 60);
            var h = Math.floor(m / 60);

            return {h: h, m: m % 60, s: s % 60};
        };

    /*returns: Number of days calculated since noon on January 1, 4713 BCE.*/
    that.toJD = function (date) {
        var Y = date.getFullYear(),
            M = date.getMonth() + 1,
            D = date.getDate();

        if (M <= 2) {
            Y -= 1;
            M += 12;
        }
        //Calc. leap years
        var A = Math.floor(Y / 100);
        var B = Math.floor(A / 4);
        var C = 2 - A + B;//valid only for dates after 1.10.1582
        var E = Math.floor(365.25 * (Y + 4716));
        var F = Math.floor(30.6001 * (M + 1));

        return C + D + E + F - 1524.5;
    };

    //Function calculates GMST at 0h
    that.calcGMST = function (date) {
        var H = 12;
        var jd0 = that.toJD(date);
        var jd = jd0 + H / 24;
        var d = jd - 2451545.0;
        var d0 = jd0 - 2451545.0;
        var t = d / 36525;

        /*Alternative method, but less exact according to tables from [*6] and description from [*5]:
         //GMST2
         var GMST = 18.697374558 + 24.06570982441908 * d;
         //GMST2
         GMST -= 12;
         */

        //GMST
        var GMST = 6.697374558 + 0.06570982441908 * d0 + 0.000026 * (t * t);
        //Normalize to [0-24]
        return (GMST + 24) % 24;
    };

    that.sunTimes = function (location, date, longitude) {
        //Note the 0.5!
        var d = that.toJD(date) - 2451545.0 + 0.5;
        //Mean anomaly of the Sun:
        var g = (357.529 + 0.98560028 * d) % 360;
        //Mean longitude of the Sun:
        var q = (280.459 + 0.98564736 * d)  % 360;
        //Geocentric apparent ecliptic longitude of the Sun (adjusted for aberration):
        var l = (q + 1.915 * Math.sin(decToRad(g)) + 0.020 * Math.sin(decToRad(2 * g))) % 360;

        var r = (1.00014 - 0.01671 * Math.cos(decToRad(g)) - 0.00014 * Math.cos(decToRad(2 * g)));
        var e = 23.439 - 0.00000036 * d;


        var alpha =  (((radToDec(Math.atan2(Math.cos(decToRad(e)) * Math.sin(decToRad(l)), Math.cos(decToRad(l)))) * 24) / 360) + 24) % 24;

        var EqT = q / 15 - alpha;

        //DEKLINACJA:
        var sigma = radToDec(Math.asin(Math.sin(decToRad(e)) * Math.sin(decToRad(l))));
        var phi = degToDec(location);
        var h0 = -degToDec({d:0, m:50, s:0});

        var t = Math.acos((Math.sin(decToRad(h0)) - (Math.sin(decToRad(sigma)) * Math.sin(decToRad(phi)))) / (Math.cos(decToRad(sigma)) * Math.cos(decToRad(phi))));

        var set = radToDec(t) + 180;
        var rise = 360 - set;
        set -= (EqT * 15);
        rise -= (EqT * 15);

        set -= longitude.d;
        rise -= longitude.d;
        var time = set - rise;

        return {rise: decToTime(rise), set: decToTime(set), daytime: decToTime(time)};
    };

    return that;
}

var s = sunrise();
console.log(s.sunTimes({d: 100, m: 0, s: 0}, new Date(Date.UTC(2013, 5, 22)), {d: 0}));
