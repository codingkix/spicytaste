angular.module('spicyTaste')
    .directive('imageUpload', function(UtilityService) {
        'use strict';
        return {
            restrict: 'E',
            scope: {
                image: '='
            },
            replace: true,
            transclude: false,
            templateUrl: 'ng/views/templates/imageUpload.html',
            controller: function($scope) {
                $scope.uploadStatus = {
                    progress: 0,
                    done: false,
                    error: false,
                    imageUrl: ''
                };

                $scope.changeUploadStatus = function(uploadStatus) {
                    angular.extend($scope.uploadStatus, uploadStatus);

                    if (uploadStatus.imageUrl && uploadStatus.imageUrl.trim() !== '') {
                        $scope.image = uploadStatus.imageUrl;
                    }

                    $scope.$apply();
                };
            },
            link: function($scope, $elements) {

                var fileBtn = $elements.find('input.file');

                fileBtn.on('change', function(event) {
                    $scope.changeUploadStatus({
                        progress: 0,
                        error: false,
                        done: false
                    });
                    var files = event.target.files;
                    var file = files[0];
                    UtilityService.awsUpload(file, null, $scope.changeUploadStatus);
                });

            }
        };
    });
