import { randomBytes } from '@ethersproject/random';
import { BigNumber } from '@ethersproject/bignumber';
import { arrayify } from '@ethersproject/bytes';
import { toUtf8Bytes, toUtf8String } from '@ethersproject/strings';
import shutterWasm from '@shutter-network/shutter-crypto/dist/shutter-crypto.wasm?url';
import { init, encrypt, decrypt } from '@shutter-network/shutter-crypto';

export default async function encryptChoice(
  choice: string,
  id: string
): Promise<string | null> {
  console.log('🚀 ~ file: shutter.ts ~ line 42 ~ choice', choice, id);
  await init(shutterWasm);

  const bytesChoice = toUtf8Bytes(choice);
  console.log('🚀 ~ file: shutter.ts ~ line 45 ~ bytesChoice', bytesChoice);

  const message = arrayify(bytesChoice);
  const eonPublicKey = arrayify(
    '0x0B94B81B1CC392CBD4604EB90E3F4355FA6925D56AC10BBD01E62A9430869B2316F749CAFB20E379BE3AF06701766836A1A0F6A891B090A5789B9BBCEABE3CE40DD32957CBF7EB6775F4BD513A3019EE33CC03568100042F02AC67943680A9DC29AD04AC0A4A4673521A8FC8FEED080977AF44CD23FF7EB4E62E1A11BCC634FC'
  );
  const proposalId = arrayify(id);
  // sigma is a salt value. It should be generated randomly and not be stored since it can be used
  // to decrypt the message.
  const sigma = arrayify(BigNumber.from(randomBytes(32)));

  const encryptedMessage = await encrypt(
    message,
    eonPublicKey,
    proposalId,
    sigma
  );
  console.log(
    '🚀 ~ file: shutter.ts ~ line 33 ~ encryptedMessage',
    encryptedMessage
  );

  // This key has been generated for above eon key and proposal id.
  const decryptionKey = arrayify(
    '0x219BA688C8505178E50E7E4FEAEFA21BDA69172E71B980A365F6F873DC9B3AAA20076B6D92CB58B24D14B70789A0B37418A0508624C83A7C8E35ED0A8DBB0E4B'
  );
  const decryptedMessage = await decrypt(
    arrayify(encryptedMessage),
    decryptionKey
  );

  console.log('message:', message);
  console.log('encrypted:', encryptedMessage);
  console.log('decrypted:', toUtf8String(decryptedMessage));

  return encryptedMessage ?? null;
}
