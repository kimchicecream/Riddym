import boto3
import os
import uuid
# import ssl
# import certifi

# print("SSL Certificate Path:", certifi.where())
# print("Default OpenSSL Version:", ssl.OPENSSL_VERSION)


# ssl_context = ssl.create_default_context(cafile=certifi.where())

BUCKET_NAME_MP3 = os.environ.get("S3_BUCKET_MP3")
BUCKET_NAME_IMG = os.environ.get("S3_BUCKET_IMG")

print(f"BUCKET_NAME_MP3: {BUCKET_NAME_MP3}")
print(f"BUCKET_NAME_IMG: {BUCKET_NAME_IMG}")

S3_LOCATION_MP3 = f"https://{BUCKET_NAME_MP3}.s3.amazonaws.com/"
S3_LOCATION_IMG = f"https://{BUCKET_NAME_IMG}.s3.amazonaws.com/"

ALLOWED_EXTENSIONS_MP3 = {"mp3"}
ALLOWED_EXTENSIONS_IMG = {"jpg", "jpeg", "png", "gif"}

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.environ.get("S3_KEY"),
    aws_secret_access_key=os.environ.get("S3_SECRET"),
    # config=boto3.session.Config(signature_version='s3v4'),
)

def get_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = uuid.uuid4().hex
    return f"{unique_filename}.{ext}"

def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def upload_file_to_s3(file, bucket_name, s3_location, acl="public-read"):
    unique_filename = get_unique_filename(file.filename)
    try:
        # Read the file content
        file_content = file.read()
        print(f"File content type: {type(file_content)}, length: {len(file_content)}")
        print(f"Uploading file: {unique_filename} to bucket: {bucket_name}")

        # Upload the file to S3
        s3.put_object(
            Bucket=bucket_name,
            Key=unique_filename,
            Body=file_content,
            ACL=acl,
            ContentType=file.content_type
        )
        print(f"File uploaded successfully: {unique_filename}")
    except Exception as e:
        print(f"Error uploading file to S3: {str(e)}")
        return {"errors": str(e)}

    return {"url": f"{s3_location}{unique_filename}"}

def remove_file_from_s3(file_url, bucket_name):
    key = file_url.rsplit("/", 1)[1]
    try:
        s3.delete_object(
            Bucket=bucket_name,
            Key=key
        )
    except Exception as e:
        return {"errors": str(e)}
    return True

def upload_mp3_to_s3(file):
    if file is None:
        return {"errors": "No file provided"}
    if not allowed_file(file.filename, ALLOWED_EXTENSIONS_MP3):
        return {"errors": "File type not allowed"}
    return upload_file_to_s3(file, BUCKET_NAME_MP3, S3_LOCATION_MP3)

def upload_image_to_s3(file):
    if file is None:
        return {"errors": "No file provided"}
    if not allowed_file(file.filename, ALLOWED_EXTENSIONS_IMG):
        return {"errors": "File type not allowed"}
    return upload_file_to_s3(file, BUCKET_NAME_IMG, S3_LOCATION_IMG)

def remove_mp3_from_s3(file_url):
    return remove_file_from_s3(file_url, BUCKET_NAME_MP3)

def remove_image_from_s3(file_url):
    return remove_file_from_s3(file_url, BUCKET_NAME_IMG)
