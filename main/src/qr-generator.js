import QRCode from 'react-native-qrcode-svg';

function QR({value}) {
  return (
    <QRCode
      value={String(value)}
      size={235}
      color="white"
      backgroundColor="black"
      logo={{
        url: 'https://media.licdn.com/dms/image/D4D0BAQE-DR87MV5E2A/company-logo_200_200/0/1666890424616?e=2147483647&v=beta&t=OxI_r4czv8iEamU-V05b62yOX_Xy4dh6a02UOFWtXFM',
      }}
      logoSize={75}
      logoBorderRadius={15}
      logoBackgroundColor="transparent"
    />
  );
}

export default QR;
