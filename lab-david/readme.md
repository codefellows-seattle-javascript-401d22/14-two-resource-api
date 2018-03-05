# Insurance API

## Insured Routes

`GET: /api/insured/:insuredId` - returns insured with life policies populated

`POST: /api/insured` - posts new insured record

`PUT: /api/insured/:insuredId` - updates insured record

`DELETE: /api/insured/:insuredId` - deleted insured record

## Life Policy Routes

`GET: /api/lifepolicy/:lifepolicyId` - return life policy with illustrations populated

`POST: /api/insured/:insuredId/lifepolicy` - posts new life policy associated with existing insured

`PUT: /api/lifepolicy/:lifepolicyId` - updated life policy record

`DELETE: /api/insured/:insuredId/lifepolicy/:lifepolicyId` - deletes lfie policy record and removes it from parent insured.lifepolicies array

## Illustration Routes

`POST: /api/lifepolicy/:lifepolicyId/illustration` - posts new illustration associated with existing life policy