export let confirmationResult: any = null;
export let storedPhone: string = '';
export let storedPassword: string = '';
export let storedName: string = '';
export let storedSurname: string = '';
export let storedBirthDate: string = '';

export function setConfirmationResult(result: any) {
    confirmationResult = result;
}

export function setStoredCredentials(phone: string, password: string) {
    storedPhone = phone;
    storedPassword = password;
}

export function setStoredProfile(name: string, surname: string, birthDate: string) {
    storedName = name;
    storedSurname = surname;
    storedBirthDate = birthDate;
}
