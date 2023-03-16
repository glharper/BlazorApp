export function startRecognizer(key, region) {
    const SpeechSDK = window.SpeechSDK;
    if (!SpeechSDK) {
        window.console.log("Speech SDK not loaded properly!");
        return;
    }

    const config = SpeechSDK.SpeechConfig.fromSubscription(key, region);
    const file = document.getElementById("audioFile").files[0];
    const audioConfig = SpeechSDK.AudioConfig.fromWavFileInput(file);
    const reco = new SpeechSDK.SpeechRecognizer(config, audioConfig);
    const phraseDiv = document.getElementById("phraseDiv");
    reco.recognizeOnceAsync(
        function (result) {
            window.console.log(result);

            phraseDiv.innerHTML += "(continuation) Reason: " + SpeechSDK.ResultReason[result.reason];
            switch (result.reason) {
                case SpeechSDK.ResultReason.RecognizedSpeech:
                    phraseDiv.innerHTML += " Text: " + result.text;
                    break;
                case SpeechSDK.ResultReason.NoMatch:
                    var noMatchDetail = SpeechSDK.NoMatchDetails.fromResult(result);
                    phraseDiv.innerHTML += " NoMatchReason: " + SpeechSDK.NoMatchReason[noMatchDetail.reason];
                    break;
                case SpeechSDK.ResultReason.Canceled:
                    var cancelDetails = SpeechSDK.CancellationDetails.fromResult(result);
                    phraseDiv.innerHTML += " CancellationReason: " + SpeechSDK.CancellationReason[cancelDetails.reason];

                    if (cancelDetails.reason === SpeechSDK.CancellationReason.Error) {
                        phraseDiv.innerHTML += ": " + cancelDetails.errorDetails;
                    }
                    break;
            }

            phraseDiv.innerHTML += result.text + "\r\n";
        },
        function (err) {
            window.console.log(err);

            phraseDiv.innerHTML += "ERROR: " + err;
        });
}

