class ResponseBody:
    def __init__(self, success: bool, message: str) -> None:
        self.success = success
        self.message = message
    
    def jsonify(self):
        return { "success": self.success, "message": self.message }