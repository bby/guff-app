function Guff() {
}

Guff.prototype = {
    loc: null,
    watchId: null,
    maxchars: 141,
    db: null,
    
    init: function() {
        //bind interactions - ******this should probably be moved till after we are happy with accuracy******
        this.postMessage();
        this.refreshLocation();
        this.countDown();
        //kick things off
        this.getLocation();
    },
    
    getLocation: function() {
        console.log('getting location');
        var o = this;
        this.watchId = navigator.geolocation.watchPosition(function(loc) {  o.checkAccuracy(loc); }, function(error) { o.errorHandler('geo', 'Unable to get location', error); }, {
            enableHighAccuracy: true,
            maximumAge: 1000
        });
    },
    
    refreshLocation: function() {
        var o = this;
        $("#locationRefresh").on("click", function(e) {
            console.log('refreshing location');
            o.getLocation();
        });
    },
    
    getFollowedLocations: function() {
        var o = this;
        $("#followButton").on("click", function(e) {
            o.followLocation();
        });
        
        this.db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM followed_locations', [], function (tx, results) {
              var len = results.rows.length, i;
              var append = "";
              for (i = 0; i < len; i++) {
                append += "<li><a href='#followed_location' class='followed-location' data-fl-name='"+results.rows.item(i).name+"' data-fl-lat='"+results.rows.item(i).latitude+"' data-fl-lng='"+results.rows.item(i).longitude+"'>"+results.rows.item(i).name+"</a></li>";
                console.log(results.rows.item(i));
              }
               $("#followed-locations").html(append);
               o.showFollowedLocation();
            });        
        });
    },
    
    followLocation: function() {
        var o = this;
        var name = $("#followed-location-name").val();
        console.log($("#followed-location-name").val());
        this.db.transaction(function(tx) {
            console.log(name);
            console.log('creating tables and inserting data');
            tx.executeSql("CREATE TABLE IF NOT EXISTS followed_locations(ID INTEGER PRIMARY KEY ASC, latitude FLOAT, longitude FLOAT, name STRING, created_at DATETIME)", []);
            tx.executeSql("INSERT INTO followed_locations(longitude, latitude, name) VALUES ('"+o.loc.coords.latitude+"','"+o.loc.coords.longitude+"','"+name+"')");
        });
    },
    
    showFollowedLocation: function() {
        var o = this;
        $("#showFollowedLocations").on("click", function(e) {
            
            if($("#followed-locations-list").css('display') == 'none') {
                $("#followed-locations-list").css({'display':'block'});
                $("#followed-locations-list").animate({
                  opacity: 1
                }, 500, 'ease-out');
            } else {

                $("#followed-locations-list").animate({
                  opacity: 0
                }, 500, 'ease-out');
                $("#followed-locations-list").css({'display':'none'});
            }
        });
        
        $(".followed-location").on("click", function(e){
            console.log('clicked');
            var lat = $(this).attr('data-fl-lat');
            var lng = $(this).attr('data-fl-lng');
            $("#fl-name").html($(this).attr('data-fl-name'));
            o.getMessages(lat, lng, "#followed-location-messages");
        });
        
        $(".followed-location").on("click", function(e){
            console.log('clicked');
            var lat = $(this).attr('data-fl-lat');
            var lng = $(this).attr('data-fl-lng');
            $("#fl-name").html($(this).attr('data-fl-name'));
            o.getMessages(lat, lng, "#followed-location-messages");
        });
    },
    
    checkAccuracy: function(loc) {
        // put check in for accuracy location.coords.accuracy
        console.log('checking accuracy');
        console.log('accuracy at: ' + loc.coords.accuracy);
        if(loc.coords.accuracy < 100) {
            console.log('accurate location obtained');
            console.log('accuracy at: '+loc.coords.accuracy);
            navigator.geolocation.clearWatch(this.watchId); 
            this.loc = loc;
            
            //set hidden fields for message form
            $("#accuracy").attr('value', this.loc.coords.accuracy);
            $("#latitude").attr('value', this.loc.coords.latitude);
            $("#longitude").attr('value', this.loc.coords.longitude);
            
            //create db for followed locations
            this.db = openDatabase("guff", "1.0", "Guff followed locations", 2 * 1024 * 1024);
            
            //bind interactions etc
            this.setMap();
            this.getMessages(this.loc.coords.latitude, this.loc.coords.longitude, "#messages");
            this.getFollowedLocations();
        }
    },
    
    setMap: function() {
        console.log('setting map: ' + this.loc.coords.latitude + this.loc.coords.longitude);
        $("#loading").show();
        var img = new Image();
        img.src = "http://maps.google.com/maps/api/staticmap?center="+this.loc.coords.latitude+","+this.loc.coords.longitude+"&zoom=15&size=200x200&maptype=roadmap&markers=color:blue|"+this.loc.coords.latitude+","+this.loc.coords.longitude+"&sensor=true";
        console.log(img.src);
        img.onload = function() {
            console.log('loaded map image from google');
            $("#loading").hide();
            $("#map span").html(img);
            $(img).css({width: '100%', height: 'auto'});
        }
    },
    
    getMessages: function(lat, lng, list) {
        console.log('getting messages');
        var o = this;
        var message_data = "http://guff.herokuapp.com/messages/"+lat+"/"+lng;
        var list = list;
        console.log(message_data);
        $.ajax({
          type: 'get',
          url: message_data,
          dataType: 'json',
          timeout: 8000,
          context: $('body'),
          success: function(data){ o.parseMessages(data, list); },
          error: function(xhr, type){ console.log(type); }//o.errorHandler('ajax', xhr, type); }
        });
    },
    
    parseMessages: function(data, list) {
        var o = this;
        var append = '';
        $(data).each(function(){
            append += "<li><p>"+this.message+"</p><span>"+o.remaningMessageTime(7190)+"</span></li>";
        });
        $(list).html(append);
    },
        
    postMessage: function() {
        console.log('posting message');
        var o = this;
        $('#send-guff').on('submit', function(e){
            if ($('#message').attr('value').length>0) {
                this.getTokenID(function(tokenID) {
                    $.ajax({
                         url: $('#send-guff').attr('action'),
                         type: 'post',
                         data: $('#send-guff').serialize(),
                         dataType: 'json',
                         timeout: 8000,
                         success: function(data) { 
                            console.log('message posted successfully');
                            o.notificationHandler('success','Message posted');
                            $("#back").trigger('click');
                            o.resetMessageField();
                            o.getMessages(); 
                         }
                    });
                });
            } else {
                o.errorHandler('user', 'You need to write something', '');
            }
            return false;
        });
    },
    
    resetMessageField: function() {
        $("#message").val('');
        $("#counter").html(this.maxchars);
    },
    
    newMessage: function() {
        //needs to be changed for new push updates
        var o = this;
        this.channel.bind("new_guff", function(data) {
            $("#messages").prepend("<li><p>"+data+"</p><span>"+o.remaningMessageTime(7200)+"</span></li>");
         });  
    },
    
    countDown: function() {
        var o = this;
        $('#message').bind('keydown', function(e) {
            text = $(this).val();
            noc = text.length;
            chars_left = o.maxchars - noc;
            $("#counter").html(chars_left);
            if(noc > o.maxchars) {
                $("#counter").css('color', 'red');
            } else {
                $("#counter").css('color', '#4D4D4D');
            }
        });
    },
    
    remaningMessageTime: function(seconds) {
        minutes = Math.round(seconds / 60);
        hours = minutes / 60;
        if(hours > 1) {
            if (minutes > 115) {
                var mOld = 121-minutes;
                var mS = mOld > 1 ? 's':'';
                time_message = "posted less than "+mOld+" minute"+mS+" ago";
            } else {
                time_message = 'under 2 hours left ';
            }
        } else if (hours <= 1 && minutes > 30) {
            time_message = 'under 1 hour left';
        } else if (minutes <= 30 && minutes > 2) {
            time_message = 'under 30 minutes left';
        } else {
            time_message = 'nearly outta here';
        }
        return time_message;
    },
    
    notificationHandler: function(type, message) {
      switch(type)
      {
          case 'success':
                console.log(message);
            break;
      }  
    },
    
    errorHandler: function(type, message, error) {
        switch(type)
        {
        case 'geo':
                if (error.code>0) {
                    if (error.code===1) {
                        $("#error").append("Denied");
                    } else if (error.code===2) {
                        $("#error").append("Position Unavailable");
                    } else if (error.code===3) {
                        $("#error").append("Timeout");
                    }
                }
            break;
        case 'ajax':
                $("#error").append(message);
            break;
        case 'user':
                $("#error").append(message);
            break;
        case 'db':
                $("#error").append(error.message);
                console.log(error);
            break;
        }
        
    },

    //Set up Token retrieval plugin
    getTokenID: function(callback) {
        cordova.exec(callback, getTokenFail, "PushNotification", "getToken", []);
    },
            
    getTokenFail: function(err) {
        alert("Failed to get Token")
    }
};

$(function(){
    var guff = new Guff();
    guff.init();
});

var jQT = new $.jQTouch({
    icon: 'jqtouch.png',
    addGlossToIcon: false,
    startupScreen: '/images/apple-touch-icon.png',
    statusBar: 'black',
    fixedViewport: true,
    formSelector: '.form'
});