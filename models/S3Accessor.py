import boto3

class S3Accessor():
    def __init__(self, user_id) -> None:
        _client = boto3.client('s3')
        _resource = boto3.resource('s3')

        self.user_id = user_id
        self.bucket_name = 'corpus-ranker'
        self.bucket = _resource.Bucket(self.bucket_name)
        self.client= _client

    def write_to_bucket(self, key: str, body):
        try: 
            self.bucket.put_object(Key=self._construct_key(key), Body=body)
            print(f'SUCCESSFULLY PUSHED {key} TO {self.bucket_name} S3 BUCKET')
        except Exception as e:
            print('ERROR in S3Accessor.write_to_bucket(), see logs.')
            raise e

    def read_from_bucket(self, key: str):
        try:
            response = self.client.get_object(Bucket=self.bucket_name, Key=self._construct_key(key))
            content = response['Body']

            return content
        except Exception as e:
            print('ERROR in S3Accessor.read_from_bucket(), see logs.')
            raise e

    def _construct_key(self, key:str) -> str:
        return f'{self.user_id}/{key}'