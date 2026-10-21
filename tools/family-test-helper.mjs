// Exercise the same parent setup/unlock UI used on the device.
export async function unlockAdult(page){
 await page.locator('#familyModeButton').waitFor();
 if(await page.evaluate(()=>petCareFamily.isAdult()))return;
 await page.locator('#familyModeButton').click();
 if(await page.locator('#parentBirth').count()){
  await page.locator('#parentBirth').fill('1980-01-01');
  await page.locator('#parentRepeat').fill('73194628');
 }
 await page.locator('#parentCode').fill('73194628');
 await page.locator('#parentForm [type=submit]').click();
 await page.waitForFunction(()=>petCareFamily.isAdult());
 await page.locator('#parentPanel').waitFor({state:'hidden'});
}
