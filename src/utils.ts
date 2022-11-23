export type StateSetter<A> = (state: Partial<A>) => void;

export type FlagType = {
    success: boolean,
    message: string
} 

export const getCookie = function(name: string) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
  }
