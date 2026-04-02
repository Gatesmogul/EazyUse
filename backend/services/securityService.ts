import * as LocalAuthentication from "expo-local-authentication";


export const authenticateBiometric = async (): Promise<boolean> => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) return false;

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) return false;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Authenticate to continue",
    fallbackLabel: "Use Passcode",
  });

  return result.success;
};