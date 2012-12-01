var express = require('express'),
    path = require('path'),
    fs = require('fs');
   
exports.upload = function (req, res) {
    fs.rename(req.files.pic.path , path.join(__dirname, '../public/pics/') + req.files.pic.filename);
    // console.log(path.join(__dirname, '../public/pics/') + req.files.pic.filename);
    res.redirect('/pics');
    // #DEBUG: res.send(console.dir(req.files));
};

exports.find = function (req, res) {
res.send('<form name="snapper" action="/pics" method="POST" enctype="multipart/form-data"> \
    <input onchange="document.forms.snapper.submit()" type="file" id="pic" name="pic" accept="image/*"></input> \
<script type="text/javascript"> \
var takePicture = document.querySelector("#pic");\
takePicture.onchange = function (event) {\
    // Get a reference to the taken picture or chosen file\
    var files = event.target.files,\
        file;\
    if (files && files.length > 0) {\
        file = files[0];\
    }\
};\
</script>\
</form>');
}


