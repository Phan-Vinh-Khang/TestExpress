function email_regex(email) {
    const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return email_regex.test(email)

}
function name_regexEN(name) {
    const name_regexEN = /^[a-zA-Z0-9_]{3,16}$/;
    return name_regexEN.test(name)

}
function name_regexVI(name) {
    const name_regexVI = /^[a-zA-ZÀ-ỹ][a-zA-Z0-9_\.À-ỹ]*$/;
    return name_regexVI.test(name)

}

module.exports = {
    email_regex,
    name_regexEN,
    name_regexVI
}