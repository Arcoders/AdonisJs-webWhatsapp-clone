const InvalidAccessException = use('App/Exceptions/InvalidAccessException')


class Authorization {

    check(resource, user) {

        if (this.process(resource) !== this.process(user)) throw new InvalidAccessException();

    }

    process(data) {
        return (typeof data === 'object') ? parseInt(data.id) : parseInt(data)
    }

}

module.exports = new Authorization()