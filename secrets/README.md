# secrets/ (not in git except this file)

Put the Play **upload** keystore and `keystore.properties` here on a machine that builds AABs.

```
secrets/korkortgo-upload.keystore
secrets/keystore.properties
secrets/PLAY-SIGNING.note.md
```

Create them with `npm run keystore` (refuses to overwrite). Copy `android/keystore.properties.example` if you already have a keystore.

**Never commit** `.keystore`, `.jks`, `.p12`, `keystore.properties`, or the signing note. Lionel: store the keystore + passwords in a password manager (1Password / Bitwarden) and an offline USB. Losing the upload key means a Play Console key-reset with Google.
