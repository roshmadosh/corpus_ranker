class ResponseBody:
    def __init__(self, success: bool, message: str, **kwargs) -> None:
        self.success = success
        self.message = message

        ranks = kwargs.get('ranks', None)
        self.ranks = ranks
    
    def jsonify(self):
        return { "success": self.success, "message": self.message, "ranks": self.ranks }