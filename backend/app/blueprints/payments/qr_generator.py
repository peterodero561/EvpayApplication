import json
import qrcode
import sys

import qrcode.constants

def generate_qr_code(num):
    # data to be encoded
    data = {
        "seat": num
    }

    # convert data to JSON String
    json_data = json.dumps(data)
    
    # generate qr code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(json_data)
    qr.make(fit=True)

    # create and save the image of qrcode
    img = qr.make_image(fill_color='black', back_color='white')
    file_name = f'seat_{num}_qrcode.png'
    try:
        img.save(file_name)
        print(f'QR code generated nd saved as {file_name}')
    except Exception as e:
        print(f'Error saving QR code: {e}')

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: ./qrcode_generator <Seat Number>")
        sys.exit(1)
    
    num = sys.argv[1]
    generate_qr_code(num)