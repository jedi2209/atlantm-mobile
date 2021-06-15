import ru from '../../core/lang/ru';

export const editInput = (id, value, enterTap = true, replace = false) => {
    return it('Edit ' + id, async () => {
        const el = element(by.id(id));
        await expect(el).toExist();
        if (replace) {
            await el.replaceText(value);
        } else {
            await el.typeText(value);
        }
        if (enterTap) {
            await el.tapReturnKey();
        }
    });
}

export const editSelect = (id, value, column = 0) => {
    it('Select choose ' + id, async () => {
        const el = element(by.id(id));
        const elPicker = element(by.id(id.replace('SelectInput.', 'PickerInput.')));
        await el.tap();
        await elPicker.setColumnToValue(column, value);
        await element(by.text(ru.Base.choose)).tap();
    });
}