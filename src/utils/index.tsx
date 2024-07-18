import Toast from "../components/Toast";
import { notEmptyString } from "../service/helper";

type NonTranslationKeyString<T> = T extends string ? T : never;
export function showErrorToast<T extends string>(
    errMsg?: NonTranslationKeyString<T>,
) {
    Toast.show({
        type: 'error',
        text1: notEmptyString(errMsg) ? errMsg : 'Some unexpected error occurred',
    });
}


export function showSuccessToast<T extends string>(
    message: NonTranslationKeyString<T>,
) {
    notEmptyString(message) &&
        Toast.show({
            type: 'success',
            text1: message,
        });
}

export function showInfoToast<T extends string>(
    message: NonTranslationKeyString<T>,
) {
    notEmptyString(message) &&
        Toast.show({
            type: 'Info',
            text1: message,
        });
}
