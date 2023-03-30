# UC09 - Adding Toilets to Favourites
# UC10 - View Favourited Toilets
# UC11 - Add Toilet Listing



import csv
from rest_framework.views import APIView
from django.http import JsonResponse

from ..models.User import User
from ..models.Toilet import Toilet
from ..serializers import AddToiletSerializer
from ..serializers import AddFavouriteToiletSerializer, RetrieveFavouriteToiletSerializer
from ..utils import forwardGeocoding



class AddToiletView(APIView):
    serializer_class = AddToiletSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            description = serializer.data.get("description")
            toiletType = serializer.data.get("toiletType")
            address = serializer.data.get("address")
            postalCode = serializer.data.get("postalCode")
            longitude, latitude = forwardGeocoding(address)

            if Toilet.retrieveByLongitudeLatitude(longitude, latitude) == False:
                newToilet = Toilet(description=description, 
                                toiletType=toiletType, 
                                address=address, 
                                postalCode=postalCode, 
                                longitude=longitude,
                                latitude=latitude)
                newToilet.save()
                payload = {"success_message": "Toilet added successfully"}
                return JsonResponse(payload)
            else:
                payload = {"error_status": "406",
                           "error_message": "Toilet at address already exists"}
                return JsonResponse(payload)

class AddFavouriteToiletView(APIView):
    serializer_class = AddFavouriteToiletSerializer
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            userID = serializer.data.get("userID")
            longitude = serializer.data.get("longitude")
            latitude = serializer.data.get("latitude")
            user = User.retrieveInfo(userID)
            toilet = Toilet.retrieveByLongitudeLatitude(longitude=longitude, latitude=latitude)

            # toilet not found
            if toilet == False:
                payload = {"error_message": "Toilet not found"}
                return JsonResponse(payload)

            toiletID = toilet.getToiletID()
            print(user.favToilets)
            
            # check if toilet is already a favourite
            if user.isFavourite(toiletID):
                payload = {"error_message": "Toilet already favourited"}
                return JsonResponse(payload)
            else:
                favToilets = user.getFavToilets()
                favToilets.append(toiletID)
                user.updateFavToilets(favToilets)
                payload = {"succcess_message": "Toilet favourited successfully"}
                return JsonResponse(payload)

class RetrieveFavouriteToiletView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            userID = request.session['user']
            user = User.retrieveInfo(userID=userID)
            favToilets = user.getFavToilets()
            if favToilets == []:
                payload = {"error_message": "Empty favourite toilet list"}
                return JsonResponse(payload)
            else:
                payload = {}
                counter = 1
                for toiletID in favToilets:
                    toilet = Toilet.retrieveByToiletID(toiletID)
                    if toilet == False:
                        continue
                    else:
                        coordinates = {"longitude": toilet.getLongitude(),
                                      "latitude": toilet.getLatitude()}
                        payload[str(counter)] = {"toiletID": toiletID,
                                                 "coordinates": coordinates}
                    counter += 1
                return JsonResponse(payload)
        except:
            payload = {"error_message": "Invalid user"}
            return JsonResponse(payload)

# KIV - remove favourite toilet