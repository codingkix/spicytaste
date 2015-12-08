angular.module('spicyTaste')
    .factory('UtilityService', function($timeout, $mdToast, $document, CONFIG) {
        'use strict';

        var utilityFactory = {};

        utilityFactory.debounce = function(func, wait, immediate) {
            var timeout;

            return function() {
                var context = this,
                    args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) {
                        func.apply(context, args);
                    }
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    func.apply(context, args);
                }
            };
        };

        utilityFactory.showStatusToast = function(isSuccess, message, parent) {
            $mdToast.show({
                controller: function($scope) {
                    $scope.content = message;
                    $scope.isSuccess = isSuccess;
                },
                templateUrl: 'ng/views/templates/toast.html',
                hideDelay: 2000,
                position: 'top right',
                parent: $document[0].querySelector(parent)
            });
        };

        utilityFactory.awsUpload = function(file, folder, changeUploadStatus) {

            AWS.config.update({
                accessKeyId: CONFIG.AWS_ACCESS_KEY,
                secretAccessKey: CONFIG.AWS_SECRECT_KEY
            });

            AWS.config.region = 'us-west-2';

            var bucketName = folder === null ? 'spicytaste-tmp-photos' : 'spicytaste-photos/' + folder;
            var bucket = new AWS.S3({
                params: {
                    Bucket: bucketName
                }
            });

            var params = {
                Key: file.name,
                ContentType: file.type,
                Body: file,
                ServerSideEncryption: 'AES256'
            };

            var request = bucket.putObject(params);
            setTimeout(request.abort.bind(request), 5000); //abort the request after 5 sec

            if (changeUploadStatus) {
                request.on('httpError', function(err, response) {
                    console.log('upload err', err);

                    changeUploadStatus({
                        error: true
                    });

                    $timeout(function() {
                        changeUploadStatus({
                            error: false
                        });
                    }, 300);

                }).on('httpDone', function(response) {
                    changeUploadStatus({
                        imageUrl: 'https://s3-us-west-2.amazonaws.com/' + bucketName + '/' + file.name
                    });

                    $timeout(function() {
                        changeUploadStatus({
                            done: true,
                            progress: 0
                        });
                    }, 300);

                }).on('httpUploadProgress', function(progress, response) {
                    changeUploadStatus({
                        progress: Math.round(progress.loaded / progress.total * 100)
                    });

                }).on('error', function(response) {
                    console.log('aws putObject error', response);
                }).send();
            } else {
                return request;
            }
        };
        return utilityFactory;
    });
