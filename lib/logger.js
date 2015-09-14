function info_debug(text,object) {
    if (eniokamatrix.info_debug) {
        eniokamatrix.info_debug(text,object);
    } else {
        console.log(text,object);
    }
}
function info_warn(text,object) {
    if (eniokamatrix.info_warn) {
        eniokamatrix.info_warn(text,object);
    } else {
        console.log(text,object);
    }
}
function info_error(text,object) {
    if (eniokamatrix.info_error) {
        eniokamatrix.info_error(text,object);
    } else {
        console.log(text,object);
    }
}
function user_debug(text,object) {
    if (eniokamatrix.user_debug) {
        eniokamatrix.user_debug(text,object);
    } else {
        console.log(text,object);
    }
}
function user_warn(text,object) {
    if (eniokamatrix.user_warn) {
        eniokamatrix.user_warn(text,object);
    } else {
        console.log(text,object);
    }
}
function user_error(text,object) {
    if (eniokamatrix.user_error) {
        eniokamatrix.user_error(text,object);
    } else {
        console.log(text,object);
    }
}
