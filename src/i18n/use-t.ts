import {useLanguage} from './language-context';
import {dict} from "@/src/i18n/dict";

export const useT = () => {
	const {lang} = useLanguage();

	return (key: keyof typeof dict['en']) => {
		return dict[lang][key] ?? dict['en'][key];
	};
};