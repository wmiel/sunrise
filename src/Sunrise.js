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

//TODO: user should be able to set default values
function sunrise() {
    "use strict";

    var converter = {
        decToRad: function (deg) {
            return (deg * Math.PI) / 180;
        },
        radToDec: function (rad) {
            return (rad * 180) / Math.PI;
        },
        degToDec: function (deg) {
            return deg.d + deg.m / 60 + deg.s / 3600;
        },
        decToTime: function (deg) {
            var s = (deg * 240),
                m = Math.floor(s / 60),
                h = Math.floor(m / 60);

            return {h: h, m: m % 60, s: s % 60};
        },
        timeToDeg: function (time) {
            var s = time.s * 15,
                m = time.m * 15 + Math.floor(s / 60),
                d = time.h * 15 + Math.floor(m / 60);

            return {d: d, m: m % 60, s: s % 60};
        },
        degToTime: function (deg) {
            var s = deg.m * 4 + deg.s * 0.066666,
                m = deg.d * 4 + Math.floor(s / 60),
                h = Math.floor(m / 60);

            return {h: h, m: m % 60, s: s % 60};
        }
    };

    var that = {},
        decToRad = converter.decToRad,
        degToDec = converter.degToDec,
        radToDec = converter.radToDec,
        decToTime = converter.decToTime,
        longitude_dec = 0,
        latitude_rad = 0,
        julian_days = 0,
        sigma_rad = 0,
        EqT = 0,
        h0_rad = decToRad(-degToDec({d: 0, m: 50, s: 0}));
    //PARAM -50' for large, near objects like sun

    that.converter = converter;
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
        //C valid only for dates after 1.10.1582
        var A = Math.floor(Y / 100),
            B = Math.floor(A / 4),
            C = 2 - A + B,
            E = Math.floor(365.25 * (Y + 4716)),
            F = Math.floor(30.6001 * (M + 1));

        return C + D + E + F - 1524.5;
    };

    //Function calculates GMST at 0h
    that.calcGMST = function (date) {
        var H = 12,
            jd0 = that.toJD(date),
            jd = jd0 + H / 24,
            d = jd - 2451545.0,
            d0 = jd0 - 2451545.0,
            t = d / 36525,
            GMST = 6.697374558 + 0.06570982441908 * d0 + 0.000026 * (t * t);
        //Normalize to [0-24]
        return (GMST + 24) % 24;
    };

    that.setH0 = function (deg) {
        h0_rad = decToRad(-degToDec(deg));
    };

    that.setLocation = function (location) {
        longitude_dec = degToDec(location.longitude);
        latitude_rad = decToRad(degToDec(location.latitude));

        return that;
    };

    //TODO: date validation
    that.setDate = function (date) {
        julian_days = that.toJD(date);
        //Note the 0.5!
        var d = julian_days - 2451545.0 + 0.5;
        //Mean anomaly of the Sun:
        var g = (357.529 + 0.98560028 * d) % 360;
        //Mean longitude of the Sun:
        var q = (280.459 + 0.98564736 * d)  % 360;
        //Geocentric apparent ecliptic longitude of the Sun (adjusted for aberration):
        var l_rad = decToRad((q + 1.915 * Math.sin(decToRad(g)) + 0.020 * Math.sin(decToRad(2 * g))) % 360);
        //var r = (1.00014 - 0.01671 * Math.cos(decToRad(g)) - 0.00014 * Math.cos(decToRad(2 * g)));
        var e_rad = decToRad(23.439 - 0.00000036 * d);

        var alpha =  ((radToDec(Math.atan2(Math.cos(e_rad) * Math.sin(l_rad), Math.cos(l_rad))) / 15) + 24) % 24;
        EqT = q / 15 - alpha;

        sigma_rad = Math.asin(Math.sin(e_rad) * Math.sin(l_rad));

        return that;
    };

    that.getTimes = function () {
        var time = Math.acos((Math.sin(h0_rad) - (Math.sin(sigma_rad) * Math.sin(latitude_rad))) /
            (Math.cos(sigma_rad) * Math.cos(latitude_rad)));
        var set = 180 + radToDec(time);
        var rise = 360 - set;
        set  -= ((EqT * 15) + longitude_dec);
        rise -=  ((EqT * 15) + longitude_dec);
        var duration = set - rise;

        //WARN: rise or set time may be during previous/next day!
        return {rise: decToTime((rise + 360) % 360), set: decToTime(set % 360), daytime: decToTime(duration)};
    };
    return that;
}