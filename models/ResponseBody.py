class ResponseBody:
    def __init__(self, success: bool, message: str, **kwargs) -> None:
        self.success = success
        self.message = message

        ranks = kwargs.get('ranks', None)
        cookie = kwargs.get('cookie', None)
        self.ranks = ranks
        self.cookie= cookie
    
    def jsonify(self):
        return vars(self)