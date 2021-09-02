import {
  KeyboardButton,
  ReplyKeyboardMarkup,
} from "https://deno.land/x/telegram@v0.0.3/types.ts";

export class Keyboard {
  /**
     * The nested array that holds the keyboard. It will be extended every time
     * you call one of the provided methods.
     */
  public readonly keyboard: KeyboardButton[][] = [[]];

  /**
     * Allows you to add your own `KeyboardButton` objects if you already have
     * them for some reason. You most likely want to call one of the other
     * methods.
     *
     * @param buttons The buttons to add
     */
  add(...buttons: KeyboardButton[]) {
    this.keyboard[this.keyboard.length - 1]?.push(...buttons);
    return this;
  }
  /**
     * Adds a 'line break'. Call this method to make sure that the next added
     * buttons will be on a new row.
     *
     * You may pass a number of `KeyboardButton` objects if you already have the
     * instances for some reason. You most likely don't want to pass any
     * arguments to `row`.
     *
     * @param buttons A number of buttons to add to the next row
     */
  row(...buttons: KeyboardButton[]) {
    this.keyboard.push(buttons);
    return this;
  }
  /**
     * Adds a new text button. This button will simply send the given text as a
     * text message back to your bot if a user clicks on it.
     *
     * @param text The text to display
     */
  text(text: string) {
    return this.add({ text });
  }
  /**
     * Adds a new contact request button. The user's phone number will be sent
     * as a contact when the button is pressed. Available in private chats only.
     *
     * @param text The text to display
     */
  requestContact(text: string) {
    return this.add({ text, request_contact: true });
  }
  /**
     * Adds a new location request button. The user's current location will be
     * sent when the button is pressed. Available in private chats only.
     *
     * @param text The text to display
     */
  requestLocation(text: string) {
    return this.add({ text, request_location: true });
  }
  /**
     * Adds a new poll request button. The user will be asked to create a poll
     * and send it to the bot when the button is pressed. Available in private
     * chats only.
     *
     * @param text The text to display
     * @param type The type of permitted polls to create, omit if the user may send a poll of any type
     */
  requestPoll(text: string, type?: "quiz" | "regular") {
    return this.add({ text, request_poll: { type } });
  }
  /**
     * Return the resulting keyboard that was built. May be called in the end if
     * necessary so you can specify more options in `reply_markup`.
     */
  // deno-lint-ignore camelcase
  build(one_time_keyboard = false) {
    var button: ReplyKeyboardMarkup = {
      keyboard: this.keyboard,
      // deno-lint-ignore camelcase
      resize_keyboard: true,
      // deno-lint-ignore camelcase
      one_time_keyboard: one_time_keyboard,
    };
    return button;
  }
}
