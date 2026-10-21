// Return from optional family activities to the main app without an entry form.
export async function unlockAdult(page){
 await page.locator('#familyModeButton').waitFor();
 if(await page.evaluate(()=>petCareFamily.isStandard()))return;
 await Promise.all([page.waitForEvent('load'),page.locator('#familyModeButton').click()]);
 await page.waitForFunction(()=>window.petCareFamily?.isStandard());
}
