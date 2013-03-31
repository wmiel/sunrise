Sunrise
=======
It's simple JavaScript module which may be used to sunrise and sunset time calculation in given place.

Usage:

    var sunriser = sunrise();
    sunriser.
        setDate(new Date(Date.UTC(2012, 2, 18))).
        setLocation({"latitude":{d:50, m:3, s:41}, "longitude":{d:19, m:56, s:18}});
    sunriser.getTimes();
    /* results in:
    { rise: { h: 4, m: 46, s: 14.699580737564247 },
      set: { h: 16, m: 50, s: 8.266904495882045 },
      daytime: { h: 12, m: 3, s: 53.5673237583178 } }
    */
    
Calculations based on:

- http://www.navipedia.pl/,
- "Astronomiczne oblicznenia nie tylko dla geografów" by Kazimierz Borkowski Uniwersytet Mikołaja Kopernika w Toruniu, Toruń 1991.
- http://www.cs.utsa.edu/~cs1063/projects/Spring2011/Project1/jdn-explanation.html
- http://quasar.as.utexas.edu/BillInfo/JulianDatesG.html
- http://aa.usno.navy.mil/faq/docs/GAST.php
- http://books.google.pl/books?id=ZnNrepLivYEC&lpg=PA17&ots=tmzu0w_Opi&dq=GMST%200hUT&hl=pl&pg=PA17#v=onepage&q=GMST%200hUT&f=false
- http://aa.usno.navy.mil/faq/docs/SunApprox.php