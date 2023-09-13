/**
 * Author: Kerry
 * Date: 6/25/12
 * Description: Jquery plugin for tooltip
 */
Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};
$.fn.tooltip = function (options) {
    var config = {
        direction: "right",
        width: "auto"
    }
    $.extend(config, options || {});
    function prepareDom() {
        if (!$('.tooltip-content')[0]) {
            $('body').append("<div class='tooltip-content'><i></i><div class='content-wrapper'></div></div><div class='tooltip-shadow'></div>");
        }
    }

    prepareDom();
    return this.each(function () {
// cache element
        var $this = $(this);
        var tooltipContent = $('.tooltip-content');
        var tooltipShadow = $('.tooltip-shadow')
// direction validation
        var direction = config.direction;
        direction = direction.replace(/\s+/g, "");
        if (!/^right$|^top$/.test(direction)) {
            return;
        }
        function resetTooltipContent() {
            tooltipContent.find('div.content-wrapper').html($this.html());
        }

        function hideAllTooltip() {
            tooltipContent.stop().animate({opacity: "1"}, 100, function () {
                tooltipContent.hide();
            });
            tooltipShadow.stop().animate({opacity: "1"}, 100, function () {
                tooltipShadow.hide();
            });
        }

        function showTooltip() {
            tooltipContent.stop().animate({opacity: "1"}, 0, function () {
                tooltipContent.show();
            });
            tooltipShadow.css({
                width: tooltipContent.outerWidth(),
                height: tooltipContent.outerHeight(),
                left: parseInt(tooltipContent.css("left")) + 3,
                top: parseInt(tooltipContent.css("top")) + 3
            }).stop().animate({opacity: "1"}, 0, function () {
                    tooltipShadow.show();
                });
        }

        function setTooltipWidth() {
            if (config.width != "auto") {
                var w = parseInt(config.width) + "px";
                tooltipContent.css({
                    maxWidth: w,
                    width: w
                });
            } else {
                tooltipContent.css({
                    maxWidth: "300px",
                    width: "auto"
                });
            }
        }

        function rightDirectionDomPosition() {
            setTooltipWidth();
            tooltipContent.hide().removeClass("top").removeClass("right").addClass(config.direction).css({
                left: $this.offset().left + $this.outerWidth() + 12,
                top: $this.offset().top - $this.outerHeight() / 4
            });
            tooltipContent.find('i').css({top: $this.outerHeight() / 4, left: "-11px", bottom: "auto"});
            showTooltip();
        }

        function topDirectionDomPosition() {
            setTooltipWidth();
            tooltipContent.hide().removeClass("top").removeClass("right").addClass(config.direction).show();
            tooltipContent.css({
                left: $this.offset().left - tooltipContent.outerWidth() / 2 + $this.outerWidth() / 2,
                top: $this.offset().top - tooltipContent.outerHeight() - 13
            });
            tooltipContent.find('i').css({top: "auto", bottom: "-11px", left: tooltipContent.outerWidth() / 2 - 12});
            showTooltip();
        }

        function showTooltipByDirection(direction) {
            resetTooltipContent();
            if (direction == "right") {
                rightDirectionDomPosition();
            } else if (direction == "top") {
                topDirectionDomPosition();
            }
        }

        function toggleTooltipClickEvent(el) {
            if (!$('body').data('tooltip')) {
                $('body').data('tooltip', []);
            }
            var isInclude = false;
            $.each($('body').data('tooltip'), function (index, item) {
                if (item.is(el)) {
                    isInclude = true;
                    return true;
                }
            });
            if (isInclude) {
                $.each($('body').data('tooltip'), function (index, item) {
                    if (item.is(el)) {
                        $('body').data('tooltip').remove(index);
                        return true;
                    }
                });
                hideAllTooltip();
            } else {
                $('body').data('tooltip').push(el);
                showTooltipByDirection(config.direction);
            }
        }

        function isIncludeTooltipFlag(el) {
            if (!$('body').data('tooltip')) {
                return false;
            }
            var result = false;
            $.each($('body').data('tooltip'), function (index, item) {
                if (item.is(el)) {
                    result = true;
                    return true;
                }
            });
            return result;
        }

        function removeAllTooltipClickEvent() {
            if (!$('body').data('tooltip')) {
                return;
            }
            $('body').data('tooltip', []);
        }

        function resetDefaultStatusForTooltip() {
            removeAllTooltipClickEvent();
            hideAllTooltip();
        }

        function toggleTooltipClickEvent4SmallDevice($this) {
            var $tooltipContentId = $this.attr('id') + "-content";
            if ($("#" + $tooltipContentId).is(':visible')) {
                $("#" + $tooltipContentId).animate({opacity: 0.75}, 0).slideUp('fast', function () {
                });
            } else {
                $("#" + $tooltipContentId).animate({opacity: 0.75}, 0).slideDown('fast', function () {
                    var $scroollTo = $this.offset().top - ($(window).height() / 2);
                    if ($scroollTo > window.pageYOffset) {
                        $('html, body').animate({scrollTop: $scroollTo}, 'slow');
                    }
                });
            }
        }

        function bind4smallDevice() {
            var $content = $this.html();
            var $id = $this.attr('id');
            var $tooltipContentId = $id + "-content";
            if ($content.length > 0) {
                $this.html('');
                $("#" + $tooltipContentId).remove();
                $this.after("<div id='" + $tooltipContentId + "' class='mobile-tooltip-content'>" + $content + "</div>");
                $("#" + $tooltipContentId).hide();
            }
            $this.unbind('mouseenter mouseleave');
            $this.unbind('click').bind('click', function (e) {
                var $clickId = $this.attr('id');
                e.stopPropagation();
                var $allTooltips = $(document).find('.tooltips');
                $allTooltips.each(function (e) {
                    var $tooltipId = $(this).attr('id');
                    if ($clickId != $tooltipId && $(this).is(':visible')) {
                        $("#" + $tooltipId + "-content").slideUp('slow', function () {
                        });
                    }
                });
                toggleTooltipClickEvent4SmallDevice($this);
            });
            $(document).unbind('click').bind('click', function () {
                $(document).find('.mobile-tooltip-content').slideUp('slow', function () {
                });
            });
        }

        function bind4Desktop() {
            $tooltipid = $this.attr('id');
            $content = $this.html();
            if ($content.length == 0) {
                if ($('#' + $tooltipid + "-content").html().length > 0) {
                    $this.html($('#' + $tooltipid + "-content").html());
                    $('#' + $tooltipid + "-content").remove();
                }
            }
            $this.unbind('click').bind('click', function (e) {
                e.stopPropagation();
                toggleTooltipClickEvent($this);
            });
            tooltipContent.unbind('click').bind('click', function (e) {
                e.stopPropagation();
            });
            $(document).bind('click', function () {
                resetDefaultStatusForTooltip();
            });
            $this.hover(function () {
                if (isIncludeTooltipFlag($this)) {
                    return;
                }
                resetDefaultStatusForTooltip();
                showTooltipByDirection(config.direction);
            }, function () {
                if (isIncludeTooltipFlag($this)) {
                    return;
                }
                hideAllTooltip();
            });
        }

        if ($("#small-device").is(":visible")) {
            bind4smallDevice();
        } else {
            bind4Desktop();
        }
    });
}