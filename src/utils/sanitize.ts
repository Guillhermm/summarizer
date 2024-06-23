export const sanitize = (input: string): string => input.replace(/[<>"']/g, '');
