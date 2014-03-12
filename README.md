twCarousel
==========

carousel system without jquery
------------------------------

###What is it ?

RoundAbout is a **javascript carousel plugin** that allow you to scroll visually some medias formated in an html list elements, pictures, text or whatever. 
At origins, it's conceived for replace [Cycle plugin](http://jquery.malsup.com/cycle2/demo/carousel.php), on a project where the suppression of the main library, the famous jQuery, was necessary. 
But in order to be efficient, the plugin keep only necessary functions for working in its original context, so you will not find exactly everything from the original cycle plugin.

###Compatibility.

Usable and testable from ie7, firefox 23.0.1, Opéra 12.16, Safari 4.0.2 and Chrome 28.0.1500.95 m 

###How to use it (fast version):

First, include the script:
`<script src="yourpath/twCarousel.js"></script>`

Then, in javascript, in the HEAD, call the methods and functions for it works :

    allnodeExample1 = twCarousel.getElementsByClassName(document.body,"example1");
    twCarousel.carouselize({noeud:allnodeExample1});
  
In CSS, just add some rules for, at least, having a "window":
    
    #example1{width:100px;height:45px;overflow:hidden;border:1px solid #555;}
    .example1{width:100px;}

And finally, in the HTML core, add in one wrapper, the list of child elements you need:

    <div id="example1">
      <div class="example1">
        <img width="100" height="36" alt="" src="i/pic0.png" />
      </div>
      <div class="example1">
    	<img width="100" height="36" alt="" src="i/pic1.png" />
      </div>
      <div class="example1">
    	<img width="100" height="36" alt="" src="i/pic2.png" />
      </div>
      <div class="example1">
    	<img width="100" height="36" alt="" src="i/pic3.png" />
      </div>
      <div class="example1">
    	<img width="100" height="36" alt="" src="i/pic4.png" />
      </div>
    </div>



###To know more :

You can use the example page in the above depository!



