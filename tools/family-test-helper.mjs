// Exercise the same parent setup/unlock UI used on the device.
export async function unlockAdult(page){
 await page.locator('#familyModeButton').waitFor();
 if(await page.evaluate(()=>petCareFamily.isAdult()))return;
 await page.locator('#familyModeButton').click();
 if(await page.locator('#parentBirth').count()){
  await page.locator('#parentBirthDay').selectOption('01');
  await page.locator('#parentBirthMonth').selectOption('01');
  await page.locator('#parentBirthYear').fill('1980');
 }
 await page.locator('#parentForm [type=submit]').click();
 await page.waitForFunction(()=>petCareFamily.isAdult());
 await page.locator('#parentPanel').waitFor({state:'hidden'});
}
