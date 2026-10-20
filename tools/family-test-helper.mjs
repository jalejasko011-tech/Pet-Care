// Exercise the real parental setup; no production bypass flag or mocked age gate.
export async function unlockParent(page){
 if(await page.evaluate(()=>window.petCareFamily?.adult===true))return;
 await page.locator('#familyReading').getByRole('button',{name:/18\+/}).click();
 if(await page.locator('#familyAge').count())await page.locator('#familyAge').fill('35');
 await page.locator('#familyPin').fill('246810');
 if(await page.locator('#familyPinRepeat').count())await page.locator('#familyPinRepeat').fill('246810');
 await page.locator('#familyUnlock').click();await page.waitForFunction(()=>window.petCareFamily?.adult===true);
}
